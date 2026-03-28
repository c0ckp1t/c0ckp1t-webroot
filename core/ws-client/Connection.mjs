/**
 *  Connection.mjs
 *
 *  Single state-machine driven connection manager.
 *  The XState machine is the sole source of truth for connection lifecycle.
 *
 *  State machine states:
 *    IDLE → FETCHING_COOKIE → CONNECTING_WS → CONNECTED → READY
 *                                                           ↕
 *                                                     AUTH_UPDATING
 *    Any failure → FAILED
 *    Closed/disconnect → DISCONNECTED
 */
import { reactive, computed, markRaw, watch } from "vue";
import { getLogger } from "Logging";
import {
    ok,
    nok,
    Code2,
    generateRandomInt32,
    toBinary,
    fromBinary,
} from "WsUtils";

import WsClient, {
    ConnectionStates,
    getCodeDescription,
} from "./WsClient.mjs";

import { interpret, createMachine } from "xstate";
import { AuthNState } from "./AuthNState.mjs";
import { map, filter } from "rxjs/operators";

// ________________________________________________________________________________
// Logging
// ________________________________________________________________________________
const LOG_HEADER = "Connection.mjs";
const logger = getLogger(LOG_HEADER);
logger.debug("INIT");

// ________________________________________________________________________________
// States that mean "usable for RPC"
// ________________________________________________________________________________
const CONNECTED_STATES = new Set(["READY"]);

// ________________________________________________________________________________
// Timeouts (ms)
// ________________________________________________________________________________
const COOKIE_TIMEOUT_MS  = 10_000;
const CONNECT_TIMEOUT_MS = 10_000;

// ________________________________________________________________________________
// WsPacket helpers (unchanged)
// ________________________________________________________________________________
class Exec2Error extends Error {
    constructor(endpoint, data) {
        if (typeof data?.message === "string") {
            super(data.message);
        } else if (typeof data === "string") {
            super(data);
        } else if (data && typeof data === "object" && typeof data.result === "string") {
            super(data.result);
        } else if (Array.isArray(data?.stack)) {
            super(data.stack);
        } else {
            super("N/A");
        }
        this.name = "Exec2Error";
        this.endpoint = endpoint;
        this.data = data;
    }
}

function executeRequestWsPacket(endpoint, args) {
    if (typeof endpoint !== "string") {
        throw `executeRequestWsPacket - endpoint must be a string`;
    }
    if (!(args instanceof Array)) {
        throw `executeRequestWsPacket - args must be an array`;
    }
    return {
        endpoint,
        id: generateRandomInt32(),
        code: Code2.EXEC_REQ,
        args,
        bytes: null,
    };
}

function execute2RequestWsPacket(endpoint, args, bytes = null) {
    if (typeof endpoint !== "string") {
        throw `execute2RequestWsPacket - endpoint must be a string`;
    }
    if (!(args instanceof Array)) {
        throw `execute2RequestWsPacket - args must be an array`;
    }
    return {
        endpoint,
        id: generateRandomInt32(),
        code: Code2.EXEC2_REQ,
        args,
        bytes,
    };
}

function execute3RequestWsPacket(endpoint, args, id = null) {
    if (typeof endpoint !== "string") {
        throw `execute3RequestWsPacket - endpoint must be a string`;
    }
    if (!(args instanceof Array)) {
        throw `execute3RequestWsPacket - args must be an array`;
    }
    if (typeof id !== "number") {
        id = generateRandomInt32();
    }
    return {
        endpoint,
        id,
        code: Code2.EXEC3_REQ,
        args,
        bytes: null,
    };
}

function execute3PublishWsPacket(id, bytes = null) {
    if (typeof id !== "number") {
        throw `execute3PublishWsPacket - id must be a number`;
    }
    if (bytes === null) {
        throw `execute3PublishWsPacket - bytes must not be null`;
    }
    return {
        endpoint: "/sys",
        id,
        code: Code2.EXEC3_PUSH,
        args: [],
        bytes,
    };
}

function execute3CloseWsPacket(id) {
    if (typeof id !== "number") {
        throw `execute3CloseWsPacket - id must be a number`;
    }
    return {
        endpoint: "/sys",
        id,
        code: Code2.EXEC3_CLOSE,
        args: [],
        bytes: null,
    };
}

/* Session metadata for cookie handshake */
function calculateSessionMetadata(uniqueId, password) {
    return {
        uniqueId,
        password,
        userAgent: navigator.userAgent,
        window: `${window.outerWidth}:${window.outerHeight}`,
        screen: `${screen.availWidth}:${screen.availHeight}`,
        proofOfWork: "0",
    };
}

// ________________________________________________________________________________
// Connection
// ________________________________________________________________________________
export default class Connection {
    // ________________________________________________________________________________
    // CONSTRUCTOR
    // ________________________________________________________________________________
    constructor(config) {
        this.instanceId = config.instanceId;
        this.client = new WsClient(this.instanceId);

        // Promise holders for connect()
        this._readyPromise = null;
        this._readyResolve = null;
        this._readyReject = null;

        // ________________________________________________________________________________
        // STORE — persisted connection settings
        // ________________________________________________________________________________
        this.store = reactive({ ...config.connection });

        // ________________________________________________________________________________
        // STATE — reactive, derived from the state machine
        //
        // The machine state is the single source of truth.
        // These reactive properties exist so Vue templates can bind to them.
        // ________________________________________________________________________________
        this.state = reactive({
            // Snapshot for dirty-checking connection config
            connectionSnapshot: JSON.stringify(this.store),
            connectionDirty: false,

            // Current machine state name  (e.g. "IDLE", "FETCHING_COOKIE", …)
            currentState: "IDLE",

            // Derived convenience booleans
            isConnected: false,
            isAuthenticated: false,

            // Error from machine context — { step, message, code? } | null
            error: null,

            // Subscription count from WsClient
            subscriptionCount: 0,

            // Retry counter from machine context
            retries: 0,
        });

        // Watch store for dirty-checking
        watch(
            () => this.store,
            (curr) => {
                this.state.connectionDirty =
                    this.state.connectionSnapshot !== JSON.stringify(curr);
            },
            { deep: true }
        );

        // ________________________________________________________________________________
        // STATE MACHINE
        // ________________________________________________________________________________
        const self = this;

        this._machine = createMachine(
            {
                predictableActionArguments: true,
                id: "connection",
                initial: "IDLE",
                context: {
                    error: null,
                    retries: 0,
                },
                states: AuthNState,
            },
            {
                // ────────────────────────────────────────────
                // Services — async work invoked by the machine
                // ────────────────────────────────────────────
                services: {
                    fetchCookie: () => self._fetchCookie(),
                    connectWs: () => self._connectWs(),
                },
            }
        );

        this.actor = markRaw(interpret(this._machine).start());

        // ________________________________________________________________________________
        // Sync machine state → reactive state
        // ________________________________________________________________________________
        this.actor.subscribe((machineState) => {
            const name = machineState.value;
            logger.debug(`[STATE] ${this.state.currentState} → ${name}`);

            this.state.currentState = name;
            this.state.isConnected = CONNECTED_STATES.has(name);
            this.state.isAuthenticated = CONNECTED_STATES.has(name);
            this.state.error = machineState.context.error ?? null;
            this.state.retries = machineState.context.retries ?? 0;

            // ── Resolve / reject promises on terminal-ish states ──
            if (name === "READY") {
                if (this._readyResolve) {
                    this._readyResolve("ready");
                    this._readyResolve = null;
                    this._readyReject = null;
                }
            }

            if (name === "FAILED") {
                const errMsg = machineState.context.error?.message ?? "Connection failed";
                if (this._readyReject) {
                    this._readyReject(errMsg);
                    this._readyResolve = null;
                    this._readyReject = null;
                    this._readyPromise = null;
                }
            }

            if (name === "DISCONNECTED") {
                this._readyPromise = null;
                this._readyResolve = null;
                this._readyReject = null;
            }
        });

        // ________________________________________________________________________________
        // WsClient status → forward into state machine
        // ________________________________________________________________________________
        this.client.subscriptionCount$.subscribe((count) => {
            this.state.subscriptionCount = count;
        });

        this.client.status().subscribe((obj) => {
            logger.debug(`[WS_STATUS] ${obj.state}`);
            switch (obj.state) {
                case ConnectionStates.ERROR:
                    this.actor.send({
                        type: "ws.error",
                        message: obj.error?.message ?? String(obj.error),
                    });
                    break;
                case ConnectionStates.CLOSED:
                    this.actor.send({
                        type: "ws.closed",
                        reason: obj.reason,
                        code: obj.code,
                    });
                    break;
                // IDLE, CONNECTING, CONNECTED are handled by invoke service promises
            }
        });

        // ________________________________________________________________________________
        // COMPUTED — URL
        // ________________________________________________________________________________
        this.url = computed(() => {
            const proto = this.store.isSecure ? "wss" : "ws";
            return `${proto}://${this.store.hostname}:${this.store.port}/${this.store.endpoint}?connectionId=${this.instanceId}`;
        });
    } // end of constructor

    // ________________________________________________________________________________
    // PUBLIC API
    // ________________________________________________________________________________
    saveConnection = () => {
        this.state.connectionSnapshot = JSON.stringify(this.store);
    };

    /**
     * Start the connection flow. Returns a promise that resolves when READY.
     * If already connected, this is a no-op — disconnect first.
     */
    connect = () => {
        if (this.state.isConnected) {
            return Promise.resolve("already connected");
        }

        if (this._readyPromise !== null) {
            return this._readyPromise;
        }

        this._readyPromise = new Promise((resolve, reject) => {
            this._readyResolve = resolve;
            this._readyReject = reject;
        });

        this.actor.send({ type: "connect" });
        return this._readyPromise;
    };

    disconnect = () => {
        logger.info("disconnect");
        if (!this.state.isConnected) {
            return;
        }
        this.client.close();
        this.actor.send({ type: "disconnect" });
    };

    // ________________________________________________________________________________
    // SERVICES — called by the state machine via invoke
    // ________________________________________________________________________________

    /**
     * Fetch session cookie via HTTP POST.
     * Uses AbortController to cancel the request on timeout.
     * @returns {Promise<void>} resolves on success, rejects with message on failure
     */
    _fetchCookie = async () => {
        logger.debug(`[SERVICE] fetchCookie — user=${this.store.username}`);
        if (typeof this.store.username !== "string") {
            throw new Error("username must be a string");
        }

        const cookieUrl = this.store.isSecure
            ? `https://${this.store.hostname}:${this.store.port}/cookie?connectionId=${this.instanceId}`
            : `http://${this.store.hostname}:${this.store.port}/cookie?connectionId=${this.instanceId}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), COOKIE_TIMEOUT_MS);

        try {
            const response = await fetch(cookieUrl, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    calculateSessionMetadata(this.store.username, this.store.password)
                ),
                signal: controller.signal,
            });
            const body = await response.text();
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} — ${body}`);
            }
            logger.debug(`[SERVICE] fetchCookie — ok`);
        } catch (err) {
            if (err.name === "AbortError") {
                throw new Error(`Timeout: cookie fetch exceeded ${COOKIE_TIMEOUT_MS}ms`);
            }
            throw err;
        } finally {
            clearTimeout(timeoutId);
        }
    };

    /**
     * Open the WebSocket connection.
     * Uses Promise.race to enforce a timeout on the connect attempt.
     * @returns {Promise<void>} resolves when WS is open, rejects on error or timeout
     */
    _connectWs = async () => {
        logger.debug(`[SERVICE] connectWs — ${this.url.value}`);
        const connectPromise = this.client.connect(this.url.value);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
                () => reject(new Error(`Timeout: WebSocket connect exceeded ${CONNECT_TIMEOUT_MS}ms`)),
                CONNECT_TIMEOUT_MS
            );
        });
        await Promise.race([connectPromise, timeoutPromise]);
        logger.debug(`[SERVICE] connectWs — ok`);
    };

    // ________________________________________________________________________________
    // EXECUTE — RPC over WebSocket
    // ________________________________________________________________________________
    /**
     * @param {string} endpoint
     * @param {Array} args
     * @returns {Promise<RPCResult>}
     */
    execute = async (endpoint, args) => {
        const pkt = executeRequestWsPacket(endpoint, args);
        logger.debug(
            `execute — endpoint=${endpoint} args=${args} id=${pkt.id}`
        );
        if (!this.state.isConnected) {
            return nok(
                `[NOT_CONNECTED] — instanceId=${this.instanceId} — state=${this.state.currentState}`,
                ["Connection.mjs", "execute", endpoint]
            );
        }
        return new Promise((resolve, reject) => {
            const obs$ = this.client.sendAndGetObservable(pkt);
            obs$.subscribe((resp) => {
                if (resp.code === Code2.EXEC_RESP) {
                    resolve(fromBinary(resp.bytes));
                } else if (resp.code === Code2.ERROR) {
                    reject(fromBinary(resp.bytes));
                }
            });
        });
    };

    // ________________________________________________________________________________
    // EXECUTE2
    // ________________________________________________________________________________
    /**
     * @param {string} endpoint
     * @param {Array} args
     * @param {*} bytes
     * @returns {Observable<WsPacket>}
     */
    execute2 = (endpoint, args, bytes) => {
        const pkt = execute2RequestWsPacket(endpoint, args, bytes);
        logger.debug(
            `execute2 — endpoint=${endpoint} args=${args} id=${pkt.id}`
        );
        if (!this.state.isConnected) {
            throw new Exec2Error(
                endpoint,
                `[NOT_CONNECTED] — instanceId=${this.instanceId} — state=${this.state.currentState}`
            );
        }
        const obs$ = this.client.sendAndGetObservable(pkt);
        return obs$.pipe(
            filter(
                (respPkt) =>
                    respPkt.code !== Code2.ACCEPT &&
                    respPkt.code !== Code2.COMPLETE
            ),
            map((respPkt) => {
                if (respPkt.code === Code2.EXEC2_RESP) {
                    return respPkt.bytes;
                } else if (respPkt.code === Code2.ERROR) {
                    throw new Exec2Error(endpoint, fromBinary(respPkt.bytes));
                } else {
                    throw new Exec2Error(
                        endpoint,
                        `[execute2] — invalid WsPacket.code=${respPkt.code}`
                    );
                }
            })
        );
    };

    /**
     * @param {string} endpoint
     * @param {Array} args
     * @param {number|null} id
     * @returns {Observable<WsPacket>}
     */
    execute3 = (endpoint, args, id = null) => {
        const pkt = execute3RequestWsPacket(endpoint, args, id);
        logger.debug(
            `execute3 — endpoint=${endpoint} args=${args} id=${pkt.id}`
        );
        if (!this.state.isConnected) {
            throw new Exec2Error(
                endpoint,
                `[NOT_CONNECTED] — instanceId=${this.instanceId} — state=${this.state.currentState}`
            );
        }
        return this.client.sendAndGetObservable(pkt);
    };

    execute3send = (id, bytes) => {
        const pkt = execute3PublishWsPacket(id, bytes);
        logger.debug(`execute3send — id=${id} size=${bytes.size}`);
        if (!this.state.isConnected) {
            return nok(
                `[NOT_CONNECTED] — instanceId=${this.instanceId} — state=${this.state.currentState}`,
                ["Connection.mjs", "execute3send"]
            );
        }
        this.client.send(pkt);
    };

    execute3Close = (id) => {
        const pkt = execute3CloseWsPacket(id);
        logger.debug(`execute3Close — id=${id}`);
        if (!this.state.isConnected) {
            return nok(
                `[NOT_CONNECTED] — instanceId=${this.instanceId} — state=${this.state.currentState}`,
                ["Connection.mjs", "execute3Close"]
            );
        }
        this.client.send(pkt);
    };
} // end of Connection
