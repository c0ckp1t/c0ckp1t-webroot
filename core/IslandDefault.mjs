// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import {markRaw, reactive, watch, defineAsyncComponent, getCurrentInstance} from 'vue'
import {ok, nok, sha1} from "JsUtils"
import {Http} from "WsUtils"
import {getLogger} from 'Logging';

// ________________________________________________________________________________
// Default Island
// ________________________________________________________________________________
/**
 *  state
 *      isLoading
 *      isReady
 *  store
 *      id
 *  connection
 */
export default class IslandDefault {
    constructor(apiMain, config) {

        this.instanceId = config.instanceId;
        this.type = "IslandDefault";
        this.config = config;
        this.apiMain = apiMain;

        this.LOG_HEADER = `${this.instanceId}`;
        this.logger = getLogger(this.LOG_HEADER);
        this.logger.debug('[INIT]');

        // ________________________________________________________________________________
        // STATE - NOT saved in browser storage
        // ________________________________________________________________________________
        this.state = reactive({
            isLoading: false,
            isReady: false
        })

        // ________________________________________________________________________________
        // STORE - saved in browser storage
        // ________________________________________________________________________________
        this.store = reactive({
            id: this.LOG_HEADER,
            updated: null,

            showRegistry: true,
            root: null,
            selectedNode: null,
        })
        this.apiMain = apiMain
    } // end of constructor

    // ________________________________________________________________________________
    // NODE METHODS
    // ________________________________________________________________________________
    routeByEndpoint = async (endpoint) => {
        this.logger.debug(`routeByEndpoint - endpoint=${endpoint}`);
        await this.apiMain.routeByEndpoint(`/${this.instanceId}${endpoint}`);
    }

    /**
     * Select the default dashboard (root).
     * @returns {Promise<void>}
     */
    selectDefaultDashboard = async () => {
        await this.apiMain.routerPush(`/${this.instanceId}`);
    }

    /**
     * Select a node and navigate to its endpoint.
     * A node has:
     *   - endpoint = "/documentation"
     *   - name = "documentation"
     * @param {Object} node
     * @returns {Promise<void>}
     */
    selectNode = async (node) => {
        this.logger.debug(`selectNode - node.endpoint=${node.endpoint}`);
        this.store.selectedNode = null;
        this.store.selectedNode = node;
        await this.apiMain.routeByEndpoint(node.endpoint);
    }

    // ________________________________________________________________________________
    // USER API
    // ________________________________________________________________________________
    userContext = async () => {
        return this.store.context
    }

    /**
     * Fetch and set the root node.
     * @returns {Promise<void>}
     */
    rootNode = async () => {
        this.logger.debug('[rootNode]');
        this.logger.debug(this.config)
        const root = this.config.root
        adjustNode(root)
        this.store.root = root
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
            return nok("[NOT_IMPLEMENTED]", ['exec']);
        } catch (e) {
            const errorMsg = `[EXCEPTION] - endpointId=${endpointId} - args=${args}`;
            this.logger.info(errorMsg);
            this.logger.info(e);
            return nok(e.toLocaleString(), ['exec', errorMsg]);
        }
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
// HELPER METHODS
// ________________________________________________________________________________
function adjustNode(node) {
    node._expanded ??= true;
    node.children.forEach((child) => {
        adjustNode(child);
    });
}

// ________________________________________________________________________________
// CONFIGURATION
// ________________________________________________________________________________
/**
 * Validate and set defaults for the island config object.
 * @param config
 * @returns {*}
 */
export function validate(config) {
    if (!config) {
        throw new Error("config is required")
    }
    if (typeof config !== 'object') {
        throw new Error("IslandDefault config must be an object must was `" + typeof config + "`")
    }
    if (typeof config.instanceId !== `string` || config.instanceId.trim() === ``) {
        throw new Error(`IslandDefault config requires non-empty instanceId property`)
    }
    config.type = "IslandDefault"
    if (!Array.isArray(config?.routes) || config.routes.length === 0) {
        config.routes = []
    }

    return config
}