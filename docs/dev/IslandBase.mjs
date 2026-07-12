// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import {reactive} from 'vue'
import {nok} from "JsUtils"
import {getLogger} from 'Logging';

// ________________________________________________________________________________
// Island Base
// ________________________________________________________________________________
/**
 * Common interface for all islands.
 *
 * Lifecycle:
 *   - init()               should connect / load root node
 *   - connect()            optional connection lifecycle (WebSocket islands)
 *   - disconnect()         optional connection lifecycle (WebSocket islands)
 *
 * Navigation:
 *   - routeByEndpoint(endpoint)
 *   - selectDefaultDashboard()
 *   - selectNode(node, route = true)
 *
 * Identity:
 *   - userContext()
 *   - rootNode()
 *
 * Execution:
 *   - exec(endpointId, args = [], bytes = null)
 *   - exec2(endpointId, args = [], bytes = null)
 *   - exec2Result(endpointId, args = [], bytes = null)
 *   - exec2ResultBinary(endpointId, args = [], bytes = null)
 *
 * HTTP / resource loading:
 *   - resolver(endpoint, type)
 *   - getText(endpoint)
 *   - getBinary(endpoint)
 *   - getJson(endpoint, params = {})
 *   - postJson(endpoint, body)
 */
export default class IslandBase {

    constructor(apiMain, config) {
        if (new.target === IslandBase) {
            throw new Error("IslandBase is abstract and cannot be instantiated directly");
        }

        this.instanceId = config.instanceId;
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
            context: null,
        })
    } // end of constructor

    // ________________________________________________________________________________
    // LIFECYCLE - override in subclasses
    // ________________________________________________________________________________
    async init() {
        throw new Error("init() must be implemented by subclass");
    }

    async connect() {
        // no-op by default
    }

    async disconnect() {
        // no-op by default
    }

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
     * @param {Boolean} route
     * @returns {Promise<void>}
     */
    selectNode = async (node, route = true) => {
        this.logger.debug(`selectNode - node.endpoint=${node.endpoint}`);
        this.store.selectedNode = null;
        this.store.selectedNode = node;
        if (route) {
            await this.routeByEndpoint(node.endpoint);
        }
    }

    // ________________________________________________________________________________
    // IDENTITY / TREE - override in subclasses
    // ________________________________________________________________________________
    userContext = async () => {
        return this.store.context;
    }

    /**
     * Fetch and set the root node.
     * @returns {Promise<void>}
     */
    rootNode = async () => {
        throw new Error("rootNode() must be implemented by subclass");
    }

    // ________________________________________________________________________________
    // EXEC API - override in subclasses
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
        throw new Error("exec2() must be implemented by subclass");
    }

    /**
     * Execute and return structured result with text STDOUT
     * @param {string} endpointId
     * @param {string[]} args
     * @param {*} bytes
     * @returns {Observable}
     */
    exec2Result(endpointId, args = [], bytes = null) {
        throw new Error("exec2Result() must be implemented by subclass");
    }

    /**
     * Execute and return structured result with STDOUT BINARY
     * @param {string} endpointId
     * @param {string[]} args
     * @param {*} bytes
     * @returns {Observable}
     */
    exec2ResultBinary(endpointId, args = [], bytes = null) {
        throw new Error("exec2ResultBinary() must be implemented by subclass");
    }

    // ________________________________________________________________________________
    // HTTP / RESOURCE LOADING - override in subclasses
    // ________________________________________________________________________________
    resolver = async (endpoint, type) => {
        throw new Error("resolver() must be implemented by subclass");
    }

    getText = async (endpoint) => {
        throw new Error("getText() must be implemented by subclass");
    }

    async getBinary(endpoint) {
        throw new Error("getBinary() must be implemented by subclass");
    }

    async getJson(endpoint, params = {}) {
        throw new Error("getJson() must be implemented by subclass");
    }

    async postJson(endpoint, body) {
        throw new Error("postJson() must be implemented by subclass");
    }

} // end of IslandBase class
