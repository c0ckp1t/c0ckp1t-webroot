/**
 *  Connection.mjs
 *
 */
import {reactive, computed, markRaw, watch} from 'vue';
import {getLogger, setLogger} from 'Logging';
import {ok, nok, Code, Code2, generateRandomInt32, toBinary, fromBinary} from 'WsUtils'

import WsClient, {ConnectionLookUp, ConnectionStates, getCodeDescription} from './WsClient.mjs'

// https://stately.ai/docs/xstate
// This is XState version 4 (specifically appears to be v4.x).
import {actions, interpret, createMachine} from "xstate";
import {AuthNState} from "./AuthNState.mjs"
import {  map,  filter } from 'rxjs/operators';

//________________________________________________________________________________
// Logging
//________________________________________________________________________________
const LOG_HEADER = 'Connection.mjs'
const logger = getLogger(LOG_HEADER)
logger.debug("INIT")

//________________________________________________________________________________
// WsPacket
// ________________________________________________________________________________
class Exec2Error extends Error {
    constructor(endpoint, data) {
        // Note: super(message) is what gets shown when you do error.toString()
        if (typeof data?.message === 'string') {
            super(data.message);  // sets error.message
        } else if (typeof data === 'string') {
            super(data.message);  // sets error.message
        } else if (data && typeof data === "object" && typeof data.result == 'string') {
            super(data.result);
        } else if(Array.isArray(data?.stack)) {
            super(data.stack);  // sets error.message
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
        console.error(endpoint)
        throw `executeRequestWsPacket - endpoint must be a string`
    }
    if (!(args instanceof Array)) {
        throw `executeRequestWsPacket - args must be an array `
    }
    return {
        "endpoint": endpoint,
        "id": generateRandomInt32(),
        "code": Code2.EXEC_REQ,
        "args": args,
        "bytes": null
    }
}

function execute2RequestWsPacket(endpoint, args, bytes = null) {
    if (typeof endpoint !== "string") {
        throw `execute2RequestWsPacket - endpoint must be a string`
    }
    if (!(args instanceof Array)) {
        throw `execute2RequestWsPacket - args must be an array `
    }
    return {
        "endpoint": endpoint,
        "id": generateRandomInt32(),
        "code": Code2.EXEC2_REQ,
        "args": args,
        "bytes": bytes
    }
}

function execute3RequestWsPacket(endpoint, args, id = null) {
    if (typeof endpoint !== "string") {
        throw `execute3RequestWsPacket - endpoint must be a string`
    }
    if (!(args instanceof Array)) {
        throw `execute3RequestWsPacket - args must be an array `
    }
    if (typeof id !== "number") {
        id = generateRandomInt32()
    }
    return {
        "endpoint": endpoint,
        "id": id,
        "code": Code2.EXEC3_REQ,
        "args": args,
        "bytes": null
    }
}

function execute3PublishWsPacket(id, bytes = null) {
    if (typeof id !== "number") {
        throw `execute3RequestWsPacket - id must be a number`
    }
    if (bytes === null) {
        throw `execute3RequestWsPacket - bytes must be not be null`
    }
    return {
        "endpoint": "/sys",
        "id": id,
        "code": Code2.EXEC3_PUSH,
        "args": [],
        "bytes": bytes
    }
}

function execute3CloseWsPacket(id) {
    if (typeof id !== "number") {
        throw `execute3CloseWsPacket - id must be a number`
    }
    return {
        "endpoint": "/sys",
        "id": id,
        "code": Code2.EXEC3_CLOSE,
        "args": [],
        "bytes": null
    }
}

/* For security used to determine if computer is a bot or attacker */
function calculateSessionMetadata(uniqueId, password) {
    return {
        'uniqueId': uniqueId,
        'password': password,
        'userAgent': navigator.userAgent,
        'window': `${window.outerWidth}:${window.outerHeight}`,
        'screen': `${screen.availWidth}:${screen.availHeight}`,
        'proofOfWork': "0"
    }
}


//________________________________________________________________________________
// Connection
// ________________________________________________________________________________
export default class Connection {

    // ________________________________________________________________________________
    // CONSTRUCTOR
    // ________________________________________________________________________________
    constructor(config) {
        this.instanceId = config.instanceId
        this.client = new WsClient(this.instanceId)
        // Hold reference to a Promise and its resolve/reject functions
        this.isReadyPromise = null
        this.isReadyResolve = null
        this.isReadyReject = null

        this.isReadyUpdatePromise = null
        this.isReadyUpdateResolve = null
        this.isReadyUpdateReject = null

        // ________________________________________________________________________________
        // STORE
        // ________________________________________________________________________________
        this.store = reactive({
            /*
                // ________________________________________________________________________________
                // WebSocket Connection
                // ________________________________________________________________________________
                hostname: Constants.HOSTNAME,
                port: parseInt(Constants.PORT) + 1,
                protocol: Constants.PROTOCOL,
                endpoint: "socket",
                username: Constants.defaultUsername,
                password: Constants.defaultPassword,
                isSecure: Constants.IS_SECURE,
             */
            ...config.connection,
        })


        // ________________________________________________________________________________
        // STATE
        // ________________________________________________________________________________
        this.state = reactive({
            connectionSnapshot: JSON.stringify(this.store),
            connectionDirty: false,
            // ________________________________________________________________________________
            // Websocket Client State
            // ________________________________________________________________________________
            // 'IDLE', 'CONNECTING', 'CONNECTED', 'ERROR', 'CLOSED'
            connStateString: "IDLE",
            subscriptionCount: 0,

            isConnected: false,
            isAuthenticated: false,
            isRequiredAction: false,
            sessionStateString: "IDLE",
            // ________________________________________________________________________________
            // ERROR
            // ________________________________________________________________________________
            retryEnable: true,
            retries: 0,
            errorMessages: [],

        });

        watch(
            () => this.store,
            (curr, prev) => {
                this.state.connectionDirty = this.state.connectionSnapshot !== JSON.stringify(curr);
            },
            {deep: true}
        )

        this.stateMachine = createMachine(
            {
                predictableActionArguments: true,
                id: 'authn',
                initial: 'IDLE',
                context: {
                    conn: this,
                },
                states: AuthNState
            },
            {
                actions: this
            }
        )
        this.actor = markRaw(interpret(this.stateMachine).start())

        // ________________________________________________________________________________
        // WsClient Events
        // ________________________________________________________________________________
        this.client.subscriptionCount$.subscribe(subscriptionCount => {
            logger.debug(`subscriptionCount - ${subscriptionCount}`)
            this.state.subscriptionCount = subscriptionCount
        })
        this.client.status().subscribe(obj => {
            logger.debug(`[STATUS] - next=${ConnectionLookUp[obj.state]} current=${this.state.sessionStateString}`)
            switch (obj.state) {
                case ConnectionStates.IDLE:
                    break;
                case ConnectionStates.CONNECTING:
                    break;
                case ConnectionStates.CONNECTED:
                    break;
                case ConnectionStates.ERROR:
                    this.actor.send({type: "client.error", data: obj.error})
                    break;
                case ConnectionStates.CLOSED:
                    this.actor.send({type: "client.closed", reason: obj.reason, code: obj.code})
                    break;
            }
            this.state.connStateString = ConnectionLookUp[obj.state]
        })

        // ________________________________________________________________________________
        // Session Events
        // ________________________________________________________________________________
        this.actor.subscribe((state) => {
            logger.debug(`[STATE_CHANGE] - ${state.value}`)
            this.state.sessionStateString = state.value
        });

        // ________________________________________________________________________________
        // COMPUTED
        // ________________________________________________________________________________
        this.url = computed(() => {
            if (this.store.isSecure) {
                return `wss://${this.store.hostname}:${this.store.port}/${this.store.endpoint}?connectionId=${this.instanceId}`;
            } else {
                return `ws://${this.store.hostname}:${this.store.port}/${this.store.endpoint}?connectionId=${this.instanceId}`;
            }
        })
    } // end of constructor

    // ________________________________________________________________________________
    // API - PUBLIC
    // ________________________________________________________________________________
    saveConnection = () => {
        this.state.connectionSnapshot = JSON.stringify(this.store)
        this.state.connectionDirty = false
    }

    /**
     * Handles connection and authentication
     */
    connect = () => {
        this.state.errorMessages = [];

        logger.debug(`this.state.isConnected= ${this.state.isConnected}`);
        if (this.state.isConnected) {
            return this.connectUpdate()
        }

        logger.debug(`this.isReadyPromise=`)
        // console.log(this.isReadyPromise)
        if (this.isReadyPromise !== null) {
            return this.isReadyPromise
        }

        this.isReadyPromise = new Promise((resolve, reject) => {
            this.isReadyResolve = resolve;
            this.isReadyReject = reject;
        });

        this.actor.send({type: "client.authenticate"});
        return this.isReadyPromise
    }

    connectUpdate = () => {
        this.isReadyUpdatePromise = new Promise((resolve, reject) => {
            this.isReadyUpdateResolve = resolve;
            this.isReadyUpdateReject = reject;
        });
        this.actor.send({type: "authenticate.update"});
        return this.isReadyUpdatePromise
    }

    disconnect = () => {
        logger.info(`disconnect`)
        if (!this.state.isConnected) {
            return
        }
        this.client.close()
        this.actor.send({type: "client.disconnect"})
    }

    cookieUrl = () => {
        if (this.store.isSecure) {
            return `https://${this.store.hostname}:${this.store.port}/cookie?connectionId=${this.instanceId}`;
        } else {
            return `http://${this.store.hostname}:${this.store.port}/cookie?connectionId=${this.instanceId}`;
        }
    }

    // CHECK RESPONSE, should send back uniqueId
    fetchCookie = async (uniqueId, password) => {
        try {
            // Options object for the fetch call to make a POST request
            const options = {
                method: 'POST',
                // Note:  different port = different ORIGIN
                // It tells the browser to send and accept cookies on cross-origin requests.
                // default is 'same-origin'
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(calculateSessionMetadata(uniqueId, password)),
            };
            // Make the HTTP call using fetch with the specified options
            logger.debug(options);
            const response = await fetch(this.cookieUrl(), options);
            const body = await response.text()
            if (!response.ok) {
                logger.warn(`[fetchCookie] - nok - ${body} `)
                return nok(`HTTP error! status: ${response.status} - ${body}`, ["fetchCookie"])
            }
            logger.debug(`[fetchCookie] ok - ${body}`)
            return ok(response.statusText)
        } catch (error) {
            return nok(`${error}`, ["fetchCookie"])
        }
    }

    // ________________________________________________________________________________
    // API - STATE MACHINE
    // ________________________________________________________________________________
    idle = (context, event) => {
        logger.debug(`[SM] - idle`)
    }
    // ________________________________________________________________________________
    // API - STATE MACHINE - AUTHENTICATE
    // ________________________________________________________________________________
    authenticate = async (context, event) => {
        logger.debug(`authenticate() - ${this.store.username}`)
        if (typeof this.store.username !== "string") {
            throw `authenticate - username must be a string`
        }
        try {
            const resCookie = await this.fetchCookie(this.store.username, this.store.password)
            if (resCookie.isOk) {
                this.actor.send({type: "authenticate.ok"})
            } else {
                this.state.errorMessages.push(resCookie.stack[0])
                this.state.errorMessages.push(resCookie.result)
                this.actor.send({type: "authenticate.nok"})
            }
        } catch (error) {
            logger.warn("[AUTHENTICATE_ERROR]")
            logger.warn(error)
            this.state.errorMessages.push("AUTHENTICATE_ERROR")
            this.state.errorMessages.push(JSON.stringify(error))
            this.actor.send({type: "authenticate.nok"})
        }
    }

    authenticationFailed = async (context, event) => {
        this.state.isAuthenticated = false
        this.isReadyReject(`authenticationFailed - ${this.state.errorMessages.join("\n")}`)
        this.isReadyPromise = null
        this.isReadyUpdatePromise = null
    }

    // ________________________________________________________________________________
    // API - STATE MACHINE - AUTHENTICATE UPDATE
    // ________________________________________________________________________________
    authenticateUpdate = async (context, event) => {
        logger.debug(`authenticateUpdate() - ${this.store.username}`)
        if (typeof this.store.username !== "string") {
            throw `authenticate - username must be a string`
        }

        let resp = await this.execute("/auth", ["login", this.store.username, this.store.password])
        if (!resp.isOk) {
            logger.debug(`[authenticateUpdate] - ${resp.result}`)
            this.state.errorMessages.push(resp.result)
            this.actor.send({type: "authenticate.update.nok"})
            this.isReadyUpdateReject(resp.result)
            return
        }
        this.isReadyUpdateResolve("ready")
        this.actor.send({type: "authenticate.update.ok"})
    }

    // ________________________________________________________________________________
    // API - STATE MACHINE - CONNECT
    // ________________________________________________________________________________
    connecting = async (context, event) => {
        logger.debug(`[SM] - connecting - ${this.state.connStateString}`)
        try {
            const res = await this.client.connect(this.url.value)
            this.actor.send({type: "client.connect.ok"})
        } catch (error) {
            logger.warn("[CONNECTION_ERROR]")
            logger.warn(error)
            this.state.errorMessages.push("Cannot connect.")
            this.state.errorMessages.push(JSON.stringify(error))
            this.actor.send({type: "client.connect.nok"})
        }
    }

    connectionNok = (context, event) => {
        logger.warn('[action] - connectionNok')
        this.state.isConnected = false
        if (this.state.retryEnable) {
            logger.debug('re-try')
        }
        this.isReadyReject(`connectionNok`)
        this.isReadyPromise = null
    }

    connectedOk = (context, event) => {
        logger.debug(`[action] - connectedOk`)
        this.state.isConnected = true
        this.actor.send({type: "connection.ok"})
    }


    ready = () => {
        this.state.isAuthenticated = true
        this.isReadyResolve("ready")
    }

    /**
     *
     * @param {object} connection - conn: Connection}
     * @param {object} event - {type: 'client.closed', reason: '', code: 1006}
     * @param {object} context -  {{action: Object, event: Object}}
     */
    disconnected = (connection, event, context) => {
        if (event.type === 'client.closed') {
            this.state.errorMessages.push(getCodeDescription(event.code))
        }
        // this.state.errorMessages = []
        this.state.isAuthenticated = false
        this.state.isConnected = false
        this.isReadyPromise = null
        this.isReadyUpdatePromise = null
    }
    // ________________________________________________________________________________
    // EXECUTE
    // ________________________________________________________________________________
    /**
     * @param endpoint
     * @param args
     * @returns {Promise<RPCResult>}
     */
    execute = async (endpoint, args) => {
        const pkt = executeRequestWsPacket(endpoint, args)
        logger.debug(`execute - endpoint=${endpoint} args=${args} id=${pkt.id}`)
        if (this.state.isConnected === false) {
            return nok(`[NOT_CONNECTED] - instanceId=${this.instanceId} - errors detected`, ["Connection.mjs", "execute", endpoint])
        }
        return new Promise(async (resolve, reject) => {
            const obs$ = this.client.sendAndGetObservable(pkt)
            obs$.subscribe(resp => {
                if (resp.code === Code2.EXEC_RESP) {
                    const res = fromBinary(resp.bytes)
                    resolve(res)
                } else if (resp.code === Code2.ERROR) {
                    const res = fromBinary(resp.bytes)
                    reject(res)
                } else if (resp.code === Code2.COMPLETE) {

                }
            })
        })
    }

    // ________________________________________________________________________________
    // EXECUTE2
    // ________________________________________________________________________________
    /**
     * @param endpoint
     * @param args
     * @param bytes
     * @returns {Observable<WsPacket>}
     */
    execute2 = (endpoint, args, bytes) => {
        const pkt = execute2RequestWsPacket(endpoint, args, bytes)
        logger.debug(`execute2 - endpoint=${endpoint} args=${args} id=${pkt.id}`)
        if (this.state.isConnected === false) {
            throw new Exec2Error(endpoint, `[NOT_CONNECTED] - instanceId=${this.instanceId} - errors detected`, ["Connection.mjs", "execute2", endpoint])
        }
        const obs$ = this.client.sendAndGetObservable(pkt)
        return obs$.pipe(
            filter(respPkt => {
                return respPkt.code !== Code2.ACCEPT && respPkt.code !== Code2.COMPLETE
            }),
            map(respPkt => {
                if (respPkt.code === Code2.EXEC2_RESP) {
                    return respPkt.bytes
                } else if (respPkt.code === Code2.ERROR) {
                    const res = fromBinary(respPkt.bytes)
                    throw new Exec2Error(endpoint, res)
                } else {
                    throw new Exec2Error(endpoint, `[execute2] - invalid WsPacket.code=${respPkt.code}`)
                }
            })
        )
    }

    /**
     *  TODO: this won't work, yeah we can't send a packet but
     *  where do we send it to. on server it won't be on stdin
     *
     * @param endpoint
     * @param args
     * @param id
     * @returns {Observable<WsPacket>}
     */
    execute3 = (endpoint, args, id = null) => {
        const pkt = execute3RequestWsPacket(endpoint, args, id)
        logger.debug(`execute3 - endpoint=${endpoint} args=${args} id=${pkt.id}`)
        if (this.state.isConnected === false) {
            throw new Exec2Error(endpoint, `[NOT_CONNECTED] - instanceId=${this.instanceId} - errors detected`, ["Connection.mjs", "execute2", endpoint])
        }
        return this.client.sendAndGetObservable(pkt)
    }

    execute3send = (id, bytes) => {
        const pkt = execute3PublishWsPacket(id, bytes)
        logger.debug(`execute3send - id=${id} size=${bytes.size}`)
        if (this.state.isConnected === false) {
            return nok(`[NOT_CONNECTED] - instanceId=${this.instanceId} - errors detected`, ["Connection.mjs", "execute3send"])
        }
        this.client.send(pkt)
    }

    execute3Close = (id) => {
        const pkt = execute3CloseWsPacket(id)
        logger.debug(`execute3Close - id=${id}`)
        if (this.state.isConnected === false) {
            return nok(`[NOT_CONNECTED] - instanceId=${this.instanceId} - errors detected`, ["Connection.mjs", "execute3Close"])
        }
        this.client.send(pkt)
    }

} // end of Connection