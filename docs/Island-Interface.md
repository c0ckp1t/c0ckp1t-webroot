
# Island Interface


Create a base class core/IslandBase.mjs that both classes extend.


### Shared Properties

```js
this.instanceId     // string
this.type           // "Island" | "IslandDefault"
this.config         // object
this.apiMain        // GlobalStore / api
this.LOG_HEADER     // string
this.logger         // Logger

this.state = reactive({
    isLoading: false,
    isReady: false
});

this.store = reactive({
    id: this.LOG_HEADER,
    updated: null,
    showRegistry: true,
    root: null,
    selectedNode: null,
    context: null
});
```

### Common Interface Methods

```js
// ---------- lifecycle ----------
async init()              // entry point
async connect()           // optional: no-op base, real in Island
async disconnect()        // optional: no-op base, real in Island

// ---------- navigation ----------
async routeByEndpoint(endpoint)
async selectDefaultDashboard()
async selectNode(node, route = true)

// ---------- data / identity ----------
async userContext()
async rootNode()

// ---------- command execution ----------
async exec(endpointId, args = [], bytes = null)
async exec2(endpointId, args = [], bytes = null)         // Island only, base throws
async exec2Result(endpointId, args = [], bytes = null)   // Island only, base throws
async exec2ResultBinary(endpointId, args = [], bytes = null) // Island only, base throws

// ---------- HTTP/resource loading ----------
async resolver(endpoint, type)
async getText(endpoint)
async getBinary(endpoint)
async getJson(endpoint, params = {})
async postJson(endpoint, body)

// ---------- node-tree helpers (Island only) ----------
async reload(node)
async findNodeByWfId(wfId)
async findNodeByEndpoint(endpoint)

```

### Base Class

```js
// core/IslandBase.mjs
import { reactive } from 'vue';
import { nok } from "JsUtils";
import { getLogger } from 'Logging';

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

        this.state = reactive({ isLoading: false, isReady: false });
        this.store = reactive({
            id: this.LOG_HEADER,
            updated: null,
            showRegistry: true,
            root: null,
            selectedNode: null,
            context: null
        });
    }

    async init() { throw new Error("init() must be implemented"); }

    // lifecycle no-ops
    async connect() { /* no-op */ }
    async disconnect() { /* no-op */ }

    // navigation
    async routeByEndpoint(endpoint) {
        await this.apiMain.routeByEndpoint(`/${this.instanceId}${endpoint}`);
    }
    async selectDefaultDashboard() {
        await this.apiMain.routerPush(`/${this.instanceId}`);
    }
    async selectNode(node, route = true) {
        this.store.selectedNode = null;
        this.store.selectedNode = node;
        if (route) await this.routeByEndpoint(node.endpoint);
    }

    // identity / tree
    async userContext() { return this.store.context; }
    async rootNode() { throw new Error("rootNode() must be implemented"); }

    // execution
    async exec() { return nok("[NOT_IMPLEMENTED]", ['exec']); }
    async exec2() { throw new Error("[NOT_IMPLEMENTED]"); }
    async exec2Result() { throw new Error("[NOT_IMPLEMENTED]"); }
    async exec2ResultBinary() { throw new Error("[NOT_IMPLEMENTED]"); }

    // HTTP
    async resolver(endpoint, type) { throw new Error("resolver() must be implemented"); }
    async getText(endpoint) { throw new Error("getText() must be implemented"); }
    async getBinary(endpoint) { throw new Error("getBinary() must be implemented"); }
    async getJson(endpoint, params = {}) { throw new Error("getJson() must be implemented"); }
    async postJson(endpoint, body) { throw new Error("postJson() must be implemented"); }
}


```