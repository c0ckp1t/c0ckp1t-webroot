/**
 * Important that you assigned it to the registry before you init it
 */
// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import {reactive, watch} from 'vue'
import {nok, indexOfNonString} from "JsUtils"
import {getLogger} from 'Logging';
import Connection from "./ws-client/Connection.mjs";

import {fromBinary, fromByteArray, Http} from "WsUtils";
import {adjustNode, adjustConfig, validateIslandConfig} from "./IslandHelpers.mjs";

import {map} from 'rxjs/operators';
import {throwError} from 'rxjs';

import IslandBase from "./IslandBase.mjs";

// ________________________________________________________________________________
// Island
// ________________________________________________________________________________
/**
 *  WebSocket Islands
 *
 *  state
 *      isLoading
 *      isReady
 *      workflowTable
 *  store
 *      id
 *  connection
 */
export default class Island extends IslandBase {

    /**
     *  Websocket Islands
     *
     *  @param apiMain
     *  @param config
     */
    constructor(apiMain, config) {
        super(apiMain, config);

        this.SERVER_API_URL = config.SERVER_API_URL;
        this.type = "Island";
        this.logger = getLogger(this.LOG_HEADER);
        this.logger.debug('[INIT]');

        this.connection = new Connection(config);

        // ________________________________________________________________________________
        // STATE - NOT saved in browser storage
        // ________________________________________________________________________________
        this.state.workflowTable = {};

        // isReady is tied to connection state
        watch(
            () => this.connection.state.isConnected,
            (connected) => {
                this.state.isReady = connected;
            }
        );

        // ________________________________________________________________________________
        // STORE - saved in browser storage
        // ________________________________________________________________________________
        this.store.context = null;
    } // end of constructor

    // ________________________________________________________________________________
    // CONNECTION MANAGEMENT
    // ________________________________________________________________________________
    async connect() {
        this.logger.info("[connect] - start ...");
        const res = await this.connection.connect();
        this.logger.info(`[connect] - res=${res}`);

        await this.userContext();
        // await this.userSettings();
        await this.rootNode();

        // if (this.store.context?.accessLevel < 500) {
        //     await this.subscribeToNotify();
        // }

        // const currentRoute = router.currentRoute.value;
        // this.logger.info(`Current route: ${currentRoute.fullPath}`);

        // if (currentRoute.fullPath === '/') {
        //     await this.routeByEndpoint(this.store.settings.defaultEndpoint);
        // }
    }

    async disconnect() {
        this.logger.info("[disconnect]");
        return this.connection.disconnect();
    }

    // ________________________________________________________________________________
    // USER API
    // ________________________________________________________________________________
    userContext = async () => {
        const resp = await this.exec('/user', ["userContext"]);
        this.logger.debug(resp);
        if (!resp.isOk) {
            this.logger.warn(`[${this.store.id}] - userContext failed`, `${resp.result}`);
            return this.store.context;
        }
        this.store.context = JSON.parse(resp.result);
        return this.store.context;
    }

    /**
     * Fetch and set the root node.
     * @returns {Promise<void>}
     */
    rootNode = async () => {
        this.logger.debug('[rootNode]');
        this.logger.debug(`[rootNode] - exec('/', [infoNode])`);
        const resp = await this.exec("/", ["infoNode"]);
        this.logger.debug(resp);
        if (!resp.isOk) {
            this.logger.error(resp.result);
            return;
        }

        const rootNode = JSON.parse(resp.result);
        adjustNode(rootNode);
        this.createWorkflowTable(rootNode);
        this.logger.debug("rootNode:");
        this.logger.debug(rootNode);

        // Note: possibly mutates rootNode
        await this._initializeRootNode(rootNode);

        this.store.root = rootNode;
    }

    /**
     * Call when we recompile or make changes to a node
     */
    reload = async (node) => {
        this.logger.debug('[reload]');
        // Should I just reload entire island? or just the node?
        // clear from routes
        // i.e, /admin/wf/c0ckp1t-com
        //      /admin/wf/c0ckp1t-com/admin
        //      /admin/auth/api
        //      /admin/auth/connections
        //      etc ...
        // clear from cache
        // i.e, /admin/v3/workflows/ocr/www/components/sidebar.vue
        //      /admin/v3/workflows/ocr/www/main.vue
        //      etc ...
        // reload root node
    }


    _initializeRootNode = async (node) => {
        node._expanded = node.expanded;
        node.store = {};
        if (node.config && typeof node.config.path === "string") {
            this.logger.debug(`[node=${node.name}] - loading=${node.config.path}`)
            const args = ["read", node.config.path];
            const res = await this.exec("/sys/resolver", args)
            if (res.isOk) {
                this.logger.debug(`[node=${node.name}] - load config=${node.config} -) ${res.result}`)
                // TODO: warning will not work if node.depth !== 1
                const config = JSON.parse(res.result.replaceAll("##instanceId##", this.instanceId))
                adjustConfig(config, this.instanceId)
                await this.apiMain.insertRoutes(`/${this.instanceId}${node.endpoint}`, config)
            } else {
                this.logger.warn(`[node=${node.name}] - failed to load config - path=${node.config.path} `)
                this.logger.debug(`endpoint=/${this.instanceId}${node.endpoint}`)
                this.logger.debug(`depth=${node.depth}`)
                this.logger.debug(`accessLevel=${this.store.context.accessLevel}`)
                // This happens when i.e osgi doesn't have a config.json
                // it tries to read it and fails
                if (node.depth === 1) {
                    if (this.store.context.accessLevel < 500) {
                        await this.apiMain.insertRoutes(`/${this.instanceId}${node.endpoint}`,
                            [{"path": node.name, "location": `/${this.instanceId}/v3/actions/root/admin/_admin.vue`}],
                        )
                    } else {
                        await this.apiMain.insertRoutes(`/${this.instanceId}${node.endpoint}`,
                            [{"path": node.name, "location": "/core/nodes/_api.vue"}]
                        )
                    }
                } else if (node.depth === 2 && node.endpoint.startsWith(`/wf/`)) {
                    this.logger.debug(`insert admin`)
                    await this.apiMain.insertRoutes(`/${this.instanceId}${node.endpoint}`,
                        [{"path": node.name, "location": `/${this.instanceId}/v3/actions/root/admin/_admin.vue`}],
                    )
                }
            }
            // NO CONFIG FOUND
        } else {
            if (node.depth === 1) {
                if (this.store.context.accessLevel < 500) {
                    await this.apiMain.insertRoutes(`/${this.instanceId}${node.endpoint}`,
                        [{"path": node.name, "location": `/${this.instanceId}/v3/actions/root/admin/_admin.vue`}],
                    )
                } else {
                    await this.apiMain.insertRoutes(`/${this.instanceId}${node.endpoint}`,
                        [{"path": node.name, "location": "/core/nodes/_api.vue"}]
                    )
                }
            }
            if (node.name === "api") {
                await this.apiMain.insertRoutes(`/${this.instanceId}${node.endpoint}`,
                    [{"path": node.name, "location": "/core/nodes/place-holder.vue"}]
                )
            }
        }

        if (node.children) {
            for (const child of node.children) {
                await this._initializeRootNode(child);
            }
        }
    }

    // ________________________________________________________________________________
    // EXEC API
    // ________________________________________________________________________________
    /**
     * Execute a command on the given endpoint.
     * @param {string} endpointId
     * @param {Array} args
     * @param {*} bytes
     * @returns {Promise<Object>}
     */
    exec = async (endpointId, args = [], bytes = null) => {
        if (typeof endpointId !== 'string') {
            return nok('[INVALID_ARGUMENT] - endpointId must be string', ['exec']);
        }
        if (!Array.isArray(args)) {
            return nok('[INVALID_ARGUMENT] - args must be an array', ['exec']);
        }
        if (!endpointId) {
            return nok(`[INVALID_ARGUMENT] - endpointId=${endpointId}`, ['exec']);
        }

        try {
            return await this.connection.execute(endpointId, args, bytes);
        } catch (e) {
            const errorMsg = `[EXCEPTION] - endpointId=${endpointId} - args=${args}`;
            this.logger.info(errorMsg);
            this.logger.info(e);
            return nok(e instanceof Error ? e.message : String(e), ['exec', errorMsg]);
        }
    }

    /**
     * Execute a command - returns an Observable, throws on validation errors
     * @param {string} endpointId
     * @param {string[]} args
     * @param {*} bytes
     * @returns {Observable}
     */
    exec2(endpointId, args = [], bytes = null) {
        if (!endpointId) {
            return throwError(() => new Error(`[INVALID_ARGUMENT] - endpointId=${endpointId}`));
        }
        if (typeof endpointId !== 'string') {
            return throwError(() => new Error('[INVALID_ARGUMENT] - endpointId must be string'));
        }
        if (!Array.isArray(args)) {
            return throwError(() => new Error('[INVALID_ARGUMENT] - args must be an array'));
        }

        const idxArgsError = indexOfNonString(args);
        if (idxArgsError !== -1) {
            return throwError(() => new Error(
                `[INVALID_ARGUMENT] - args must contain only strings but idx=${idxArgsError} is not string`
            ));
        }

        return this.connection.execute2(endpointId, args, bytes);
    }

    /**
     * Execute and return structured result with text STDOUT
     * @param {string} endpointId
     * @param {string[]} args
     * @param {*} bytes
     * @returns {Observable}
     */
    exec2Result(endpointId, args = [], bytes = null) {
        return this.exec2(endpointId, args, bytes).pipe(
            map(this._createExecResultMapper(true))
        );
    }

    /**
     * Execute and return structured result with STDOUT BINARY
     * @param {string} endpointId
     * @param {string[]} args
     * @param {*} bytes
     * @returns {Observable}
     */
    exec2ResultBinary(endpointId, args = [], bytes = null) {
        return this.exec2(endpointId, args, bytes).pipe(
            map(this._createExecResultMapper(false))
        );
    }

    // ________________________________________________________________________________
    // HTTP
    // ________________________________________________________________________________
    resolver = async (endpoint, type) => {
        this.logger.debug(`[resolver] -  endpoint=${endpoint}`)

        if (endpoint.startsWith('/c0ckp1t/')) {
            const endpointAdjusted = endpoint.replace("/c0ckp1t/", `/`)
            const path = `${this.SERVER_API_URL}${endpointAdjusted}`;
            this.logger.debug(`[resolver] - endpointAdjusted=${path}`);
            const res = await Http.getText(path)
            if (res.isOk) {
                return new Response(res.result, {status: 200, statusText: 'OK'});
            } else {
                return new Response(res.result, {status: 500, statusText: 'NOK'});
            }
        }

        const args = ["read", endpoint]
        const res = await this.exec("/sys/resolver", args)
        if (!res.isOk) {
            throw Error(`[READ_ERROR] - args=${args} - result=${res.result}`)
        }
        const text = res.result.replaceAll("##instanceId##", this.instanceId)
        return new Response(text, {status: 200, statusText: 'OK'});
    }

    getText = async (endpoint) => {
        this.logger.debug(`[getText] -  endpoint=${endpoint}`)
        if (endpoint.startsWith("http") || endpoint.startsWith("HTTP")) {
            return await Http.getText(endpoint, "omit")
        }
        if (endpoint.startsWith('/c0ckp1t/')) {
            const path = `${this.config.SERVER_API_URL}${endpoint}`;
            return await Http.getText(path)
        }
        const args = ["read", endpoint]
        const res = await this.exec("/sys/resolver", args)
        if (!res.isOk) {
            this.logger.debug(`[getText] - error - endpoint=${endpoint}`)
            throw Error(`[READ_ERROR] - args=${args} - result=${res.result}`)
        }
        return res
    }

    async getBinary(endpoint) {
        this.logger.info(`[getBinary] -  endpoint=${endpoint}`)
        if (endpoint.startsWith("http") || endpoint.startsWith("HTTP")) {
            return await Http.getBinary(endpoint, "omit")
        }
        if (endpoint.startsWith('/c0ckp1t/')) {
            const path = `${this.config.SERVER_API_URL}${endpoint}`;
            return await Http.getBinary(path)
        }

        const args = ["read", endpoint]
        return new Promise((resolve, reject) => {
            const chunks = [];
            this.exec2("/sys/resolver", args).subscribe({
                next: (pkt) => {
                    chunks.push(pkt)
                },
                error: (err) => {
                    this.logger.error(`[getBinary] - error - endpoint=${endpoint}`, err);
                    resolve({isOk: false, result: err.toString()});
                },
                complete: () => {
                    // Concatenate all chunks into a single Uint8Array
                    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
                    const merged = new Uint8Array(totalLength);
                    let offset = 0;
                    for (const chunk of chunks) {
                        merged.set(chunk, offset);
                        offset += chunk.length;
                    }
                    this.logger.debug(`[getBinary] - complete - totalBytes=${totalLength}`);
                    resolve({isOk: true, result: merged});
                }
            });
        });
    }

    async getJson(endpoint) {
        const path = `${this.config.SERVER_API_URL}${endpoint}`;
        this.logger.debug(`[getJson] - ${path}`);
        return await Http.getJson(path)
    }

    async postJson(endpoint, body) {
        const path = `${this.config.SERVER_API_URL}${endpoint}`;
        this.logger.debug(`[postJson] - ${path}`);
        return await Http.postJson(path, body)
    }

    _createExecResultMapper(convertStdoutToText = true) {
        return (pktBytes) => {
            const result = fromBinary(pktBytes);

            switch (result.type) {
                case "START":
                    return {
                        type: result.type,
                        id: result.id,
                        currentTimeMs: result.currentTimeMs,
                    };
                case "END":
                    return {
                        type: result.type,
                        runtimeMs: result.runtimeMs,
                        exitCode: result.exitCode,
                    };
                case "STDOUT":
                    return {
                        type: result.type,
                        result: convertStdoutToText ? fromByteArray(result.bytes) : result.bytes
                    };
                case "STDIELD":
                    return {
                        type: result.type,
                        result: fromByteArray(result.bytes)
                    };
                case "STDERR":
                    return {
                        type: result.type,
                        result: fromByteArray(result.bytes)
                    };
                default:
                    throw new Error(`[UNEXPECTED_TYPE] - type=${result.type}`);
            }
        };
    }

    createWorkflowTable = (node) => {
        // if endpoint starts with "/wf/" and depth is 2
        //  then we likely are looking at workflow nodes
        if (node.endpoint.startsWith("/wf/") && node.depth === 2) {
            if (typeof node.kv === 'object' && node.kv !== null && typeof node.kv["wfId"] === "string") {
                const key = node.endpoint.replace("/wf/", "")
                this.state.workflowTable[key] = node
            }
        }
        // we recurse into / and its children only.
        if (node.depth === 0 || node.depth === 1) {
            node.children.forEach((child) => {
                this.createWorkflowTable(child);
            });
        }
    }

    findNodeByWfId = (wfId) => {
        const rootNode = this.store.root
        if (!rootNode) return null
        const search = (node) => {
            if (node.kv && node.kv.wfId === wfId) return node
            if (node.children) {
                for (const child of node.children) {
                    const found = search(child)
                    if (found) return found
                }
            }
            return null
        }
        return search(rootNode)
    }

    findNodeByEndpoint = (endpoint) => {
        const rootNode = this.store.root
        if (!rootNode) return null
        const search = (node) => {
            if (node.endpoint === endpoint) return node
            if (node.children) {
                for (const child of node.children) {
                    const found = search(child)
                    if (found) return found
                }
            }
            return null
        }
        return search(rootNode)
    }

    // ________________________________________________________________________________
    // init
    // ________________________________________________________________________________
    init = async () => {
        await this.connect()
    }

} // end of Island class

// ________________________________________________________________________________
// CONFIGURATION
// ________________________________________________________________________________
export function validate(config) {
    return validateIslandConfig(config);
}
