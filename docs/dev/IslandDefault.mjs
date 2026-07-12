// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import {Http} from "WsUtils"
import {nok} from "JsUtils"
import {getLogger} from 'Logging';
import {adjustNode, validateIslandDefaultConfig} from "./IslandHelpers.mjs";

import IslandBase from "./IslandBase.mjs";

// ________________________________________________________________________________
// Default Island
// ________________________________________________________________________________
/**
 *  HTTP-backed default island.
 *
 *  state
 *      isLoading
 *      isReady
 *  store
 *      id
 *      context
 *      root
 *      selectedNode
 */
export default class IslandDefault extends IslandBase {

    constructor(apiMain, config) {
        super(apiMain, config);

        this.type = "IslandDefault";
        this.logger = getLogger(this.LOG_HEADER);
        this.logger.debug('[INIT]');

        this.store.context = null;
    } // end of constructor

    // ________________________________________________________________________________
    // CONNECTION MANAGEMENT
    // ________________________________________________________________________________
    getConnectionConfig = () => {
        return this.config;
    }

    // ________________________________________________________________________________
    // USER API
    // ________________________________________________________________________________
    userContext = async () => {
        return this.store.context;
    }

    /**
     * Fetch and set the root node.
     * @returns {Promise<void>}
     */
    rootNode = async () => {
        this.logger.debug('[rootNode]');
        this.logger.debug(this.config);
        const root = this.config.root;
        adjustNode(root);
        this.store.root = root;
    }

    // ________________________________________________________________________________
    // EXEC API
    // ________________________________________________________________________________
    /**
     * Execute a command on the given endpoint via HTTP POST.
     *
     * The endpoint is translated to the island's SERVER_API_URL.
     *
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
            const path = `${this.config.SERVER_API_URL}${endpointId}`;
            this.logger.debug(`[exec] - POST ${path}`);

            // Preserve binary path by uploading a raw body when bytes are supplied.
            let body;
            let headers = {};

            if (bytes instanceof Blob || bytes instanceof ArrayBuffer || bytes instanceof Uint8Array || bytes instanceof FormData) {
                body = bytes;
            } else if (bytes !== null && bytes !== undefined) {
                body = JSON.stringify({args, bytes});
                headers["Content-Type"] = "application/json";
            } else {
                body = JSON.stringify({args});
                headers["Content-Type"] = "application/json";
            }

            const res = await fetch(path, {
                method: "POST",
                headers,
                body
            });

            if (!res.ok) {
                const text = await res.text();
                return nok(`[HTTP_ERROR] - status=${res.status} - ${text}`, ['exec', endpointId]);
            }

            // Try JSON first, fall back to text.
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                const data = await res.json();
                return {isOk: true, result: data};
            }

            const text = await res.text();
            return {isOk: true, result: text};
        } catch (e) {
            const errorMsg = `[EXCEPTION] - endpointId=${endpointId} - args=${args}`;
            this.logger.info(errorMsg);
            this.logger.info(e);
            return nok(e instanceof Error ? e.message : String(e), ['exec', errorMsg]);
        }
    }

    /**
     * Observable execution is not supported over plain HTTP.
     */
    exec2(endpointId, args = [], bytes = null) {
        throw new Error("exec2() is not supported by IslandDefault");
    }

    exec2Result(endpointId, args = [], bytes = null) {
        throw new Error("exec2Result() is not supported by IslandDefault");
    }

    exec2ResultBinary(endpointId, args = [], bytes = null) {
        throw new Error("exec2ResultBinary() is not supported by IslandDefault");
    }

    // ________________________________________________________________________________
    // HTTP
    // ________________________________________________________________________________
    /**
     *
     * @param path
     * @param type
     * @returns {Promise<Response>}
     */
    resolver = async (path, type) => {
        /**
         * Path.normalize() in vue3-sfc-loader's defaultPathResolve
         *  collapses // in https:// down to https:/
         *  It uses Path.normalize(Path.join(Path.dirname(getPathname(refPath.toString()))
         *  but Node's posix.dirname doesn't understand URL protocols
         */
        if (path.startsWith("https:/c")) {
            path = path.replace("https:/c", "https://c");
        }
        this.logger.debug(`[resolver] - fetching - ${path} - ${type}`)
        const res = await fetch(path);
        if (!res.ok) throw Object.assign(new Error(res.statusText + ' ' + path), {res});
        return res
    }

    getText = async (endpoint) => {
        this.logger.debug(`[getText] - ${endpoint}`);
        if (endpoint.startsWith("http") || endpoint.startsWith("HTTP")) {
            return await Http.getText(endpoint, "omit")
        } else {
            const path = `${this.config.SERVER_API_URL}${endpoint}`;
            return await Http.getText(path)
        }
    }

    async getBinary(endpoint) {
        const path = `${this.config.SERVER_API_URL}${endpoint}`;
        this.logger.debug(`[getBinary] - ${path}`);
        return await Http.getBinary(path)
    }

    async getJson(endpoint, params = {}) {
        const path = `${this.config.SERVER_API_URL}${endpoint}`;
        this.logger.debug(`[getJson] - ${path}`);
        return await Http.getJson(path)
    }

    async postJson(endpoint, body) {
        const path = `${this.config.SERVER_API_URL}${endpoint}`;
        this.logger.debug(`[postJson] - ${path}`);
        return await Http.postJson(path, body)
    }

    // ________________________________________________________________________________
    // init
    // ________________________________________________________________________________
    init = async () => {
        await this.rootNode()
        this.state.isReady = true
    }

} // end of IslandDefault class

// ________________________________________________________________________________
// CONFIGURATION
// ________________________________________________________________________________
/**
 * Validate and set defaults for the island config object.
 * @param config
 * @returns {*}
 */
export function validate(config) {
    return validateIslandDefaultConfig(config);
}
