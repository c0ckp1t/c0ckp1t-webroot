/**
 * Global moduled used through entire application
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {markRaw, reactive, watch, defineAsyncComponent, createApp} from 'vue'
import * as VueRouter from 'vue-router'
import {getLogger} from 'Logging';
import {transformRoutes, loadModule, options} from "VueUtils";
import {findHostnamePortProtocol, validateAppConfig} from 'ConfigUtils'
import {substrAfterFirstSlash, extractLastPath, nok, ok} from "JsUtils";

import IslandDefault, {validate as validateIslandDefault} from 'IslandDefault'
import {validate} from "Island";

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'GlobalStore.mjs'
const logger = getLogger(LOG_HEADER)
logger.info("[INIT]")

const createAsyncComponent = (loader, name) => defineAsyncComponent({
    loader,
    onError(error, retry, fail, attempts) {
        console.error(`[ASYNC COMPONENT ERROR] ${name}:`, error)
        store.componentErrors.push({
            componentName: name,
            error: error,
            message: error.message,
            stack: error.stack,
            attempts
        })
        fail()  // or retry() if you want to attempt reloading
    }
})
// ________________________________________________________________________________
// STORE
// ________________________________________________________________________________
export const store = reactive({
    // ________________________________________________________________________________
    // Application
    // ________________________________________________________________________________
    // Text appears next to logo in pages/navigation.vue
    name: "C0ckp1t",
    id: LOG_HEADER,
    appEndpoint: "",
    serverInfo: findHostnamePortProtocol(),

    // ________________________________________________________________________________
    // Configuration
    // ________________________________________________________________________________
    config: null,
    // Documentation Configuration
    showDocReload: true,
    showDocTrail: true,
    allowDocWrite: true,
    showDocNav: true,
    // TOP NAVBAR Configuration
    showTopNavBar: true,

    // ________________________________________________________________________________
    // Registries
    // ________________________________________________________________________________
    r: {},
    defaultInstanceId: "default",
    selectedInstId: null,
    router: null,
    registryType: [
        {k: 'Remote Island', v: 'Island'},
        {k: 'Default Island', v: 'IslandDefault'}
    ],

    // ________________________________________________________________________________
    // Login
    // ________________________________________________________________________________
    isAuthenticated: false,
    username: null,

    // ________________________________________________________________________________
    // Vue App Instance - gets created in App.vue
    // ________________________________________________________________________________
    app: null,
    isReady: false,
    dashboard: null,
    dashboardName: "Nothing Loaded",
    componentErrors: [],

    // ________________________________________________________________________________
    // Main Offcanvas
    // ________________________________________________________________________________
    showSidebar: false,
    mainOffCanvas: null,
    mainOffCanvasOpen: false,
    mainOffCanvasWidth: 0,

    // ________________________________________________________________________________
    // P1t Modal
    // ________________________________________________________________________________
    modal: null,
    modalComponent: null,
    modalTitle: "N/A",
    modalDefaultDashboard:  {
        name: "Documentation Main",
        id: "/c0ckp1t/actions/markdown/markdown.vue",
        location: "/c0ckp1t/actions/markdown/markdown.vue",
        type: "COMPONENT"
    },
    modalIsOpen: false,

    mdURL: "/c0ckp1t/docs/Introduction.md",
    mdDefaultURL: "/c0ckp1t/docs/Introduction.md",

    // ________________________________________________________________________________
    // OFFCANVAS
    // ________________________________________________________________________________
    offcanvas: null,
    offCanvasSel: null,
    offCanvasArr: [
        {id: 'connection', label: 'Connection'},
        {id: 'wspackets', label: 'WsPacket Logs'},
        {id: 'alerts', label: 'Alert Logs'},
        {id: 'help', label: 'Help'},
    ],
    offcanvasOpen: false,

})


// ________________________________________________________________________________
// API
// ________________________________________________________________________________
export const api = {

    // ________________________________________________________________________________
    // Islands
    // ________________________________________________________________________________
    registerIsland: async (config) => {
        logger.debug(`[registerIsland] - instanceId=${config.instanceId}`)
        if(config.instanceId === store.defaultInstanceId) {
            throw new Error("Cannot register island with defaultInstanceId")
        }

        let island= null
        switch (config.type) {
            case "LOCAL":
            case "DEFAULT":
            case "default":
            case "IslandDefault":
                config = validateIslandDefault(config)
                island = new IslandDefault(api, config)
                await api.insertRoutes(`/${island.instanceId}`, config.routes)
                break
            default:
                try {
                    const { default: Island, validate: validateIsland } = await import(config.type)
                    config = validateIsland(config)
                    island = new Island(api, config)
                } catch(e) {
                    throw new Error(`Unknown island type: ${config.type}`)
                }
        }

        // register island in store and initialize it
        store.r[island.instanceId] = island
        await island.init()

        const currentInstanceId = substrAfterFirstSlash(api.getCurrentRoute().value.fullPath)
        if(currentInstanceId === island.instanceId) {
            store.selectedInstId = island.instanceId
        }
    },

    unregisterIsland: async (instanceId) => {
        logger.debug(`[unregisterIsland] - instanceId=${instanceId}`)
        if(instanceId === store.defaultInstanceId) {
            throw new Error("Cannot unregister Island with defaultInstanceId")
        }
        throw new Error("NOT_IMPLEMENTED - unregisterIsland")
    },

    saveIslandConfig: async (instanceId) => {
        logger.debug(`[saveIslandConfig] - instanceId=${instanceId}`)
        return nok(`[saveIslandConfig] - NOT SUPPORTED`, [store.id])
    },
    deleteIslandConfig: async (instanceId) => {
        logger.debug(`[deleteIslandConfig] - instanceId=${instanceId}`)
        return nok(`[deleteIslandConfig] - NOT SUPPORTED`, [store.id])
    },

    // ________________________________________________________________________________
    // MODULE API
    // ________________________________________________________________________________
    loadModule: async (path) => {
        try {
            logger.debug(`[loadModule] - path=${path}`);
            return await loadModule(path, options);
        } catch(e) {
            logger.error(`[loadModule] - ERROR - path=${path} - ${e}`);
            throw e // Rethrow the error so Vue can handle it
        }
    },

    options: () => {
        return options
    },

    // ________________________________________________________________________________
    // DASHBOARDS
    // ________________________________________________________________________________
    async selectLogo() {
        logger.debug("[selectLogo]")
        if (!store.mainOffCanvas) {
            logger.warn("[selectLogo] - store.mainOffCanvas=null")
            return
        }
        if(store.showSidebar){
            api.closeSideBar()
        } else {
            api.openSideBar()
        }
    },

    /**
     * return get an array with all the route records.
     */
    getRoutes: () => {
        return store.router.getRoutes()
    },
    /**
     *
     * @returns Vue ref to the current route
     */
    getCurrentRoute: () => {
        return store.router.currentRoute
    },

    getRouter: () => {
        return store.router
    },

    routeByEndpoint: async (endpoint) => {
        const path = endpoint.split("/")
        logger.debug(`[routeByEndpoint] - endpoint=${endpoint}, path=${path}`)
        try {
            if(path.length > 3) {
                extractLastPath(endpoint)
                document.title = `${path[2]}-${path[3]}`
            } else if (path.length === 3) {
                document.title = `${path[2]}`
            }
            await store.router.push(endpoint)
        } catch (err) {
            console.error("Failed to navigate:", err)
        }
    },

    /**
     *  [
     *      { path: String, routes: [], name: "" },
     *      { path: String, routes: [], name: "" },
     *  ]
     */
    insertRoutes: async (endpoint, config) => {
        const endpointCleaned = endpoint.replace(/\/+$/, '')
        const routerName = endpointCleaned.replaceAll('/', '-').replace(/^\-+/, '')
        const routerPath = endpointCleaned
        logger.debug(`insertRoutes \n endpoint=${endpointCleaned} \n routerName=${routerName} \n routerPath=${routerPath}`);

        const vueNestedRoutes = transformRoutes( api.loadModule, config)
        logger.debug(`vueNestedRoutes:`)
        logger.debug(vueNestedRoutes)

        await store.router.addRoute({
            name: routerName,
            path: routerPath,
            component: vueNestedRoutes[0].component,
            children: vueNestedRoutes[0].children
        })
    },


    // ________________________________________________________________________________
    // REGISTRY SIDEBAR
    // ________________________________________________________________________________
    openSideBar() {
        store.mainOffCanvas.show()
        store.showSidebar = true
    },
    closeSideBar() {
        store.mainOffCanvas.hide()
        store.showSidebar = false
    },

    // ________________________________________________________________________________
    // OFFCANVAS
    // ________________________________________________________________________________
    toggleOffCanvas() {
        store.offcanvasOpen = !store.offcanvasOpen;
    },

    // ________________________________________________________________________________
    // INIT
    // ________________________________________________________________________________
    async init(id, config) {
        logger.info(`[INIT] - ${id}`)

        // validate VueJS mount point exists
        const selector = `#${id}`
        const el = document.querySelector(selector)
        if (!el) {
            logger.warn(`Mount point "${selector}" not found`)
            return null
        }

        validateAppConfig(config)
        store.config = config
        store.appName = config.appName
        store.showSidebar = config.showSidebar

        //________________________________________________________________________________
        // Create Vue Application
        //________________________________________________________________________________
        const app = createApp({
            mounted() {
                console.log(`[${store.name}] - Mounted Application`)
            }
        })
        store.app = markRaw(app)
        app.config.globalProperties.$moment = window.moment
        app.config.errorHandler = (err, vm, info) => {
            console.error('Global error handler:', err, vm, info);
        };
        app.config.warnHandler = (err, vm, info) => {
            console.warn('Global warn handler:', err, vm, info);
        };

        //________________________________________________________________________________
        // Create Default Island
        //________________________________________________________________________________
        // Load default island
        const decoratedIslandConfig = {
            ...config,
            SERVER_API_URL: store.serverInfo.serverUrl,
        }
        const islandDefault = new IslandDefault(api, decoratedIslandConfig)
        store.r[islandDefault.instanceId] = islandDefault
        await islandDefault.init()

        // Create Vue Router
        const vueRouterModeIsHash = config.vueRouterModeIsHash ?? true
        const router = VueRouter.createRouter({
            history: vueRouterModeIsHash ? VueRouter.createWebHashHistory() : VueRouter.createWebHistory(),
            routes: transformRoutes(api.loadModule, config.routes)
        })
        store.router = markRaw(router)

        // Main entry point for the app, this will load the main application
        app.component('app-main', createAsyncComponent(() => api.loadModule(config.appMainComponent)))

        // Configure C0ckp1t Vue Components
        const vueComponents = config.components ?? {}
        for (const [key, value] of Object.entries(vueComponents)) {
            app.component(key, defineAsyncComponent(() => api.loadModule(`${value.path}`)))
        }

        app.use(router)
        app.mount(selector)
        await router.isReady()

        const currentInstanceId = substrAfterFirstSlash(api.getCurrentRoute().value.fullPath)
        if(currentInstanceId === islandDefault.instanceId) {
            store.selectedInstId = islandDefault.instanceId
        }
        store.isReady = true
    }
}

