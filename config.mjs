/**
 * ============================================================================
 *  C0ckp1t Application Configuration — DEFAULT TEMPLATE
 * ============================================================================
 *
 *  THIS IS THE SINGLE SOURCE OF TRUTH FOR CONFIGURING A C0ckp1t APP.
 *
 *  HOW TO USE:
 *    1. Copy this file to `config.mjs`:   cp config.default.mjs config.mjs
 *    2. Edit `config.mjs` to match your application.
 *    3. `index.html` imports `config.mjs` — you never edit index.html for config.
 *
 *  DESIGN NOTES (read me):
 *    - This is a PLAIN OBJECT. There is no factory, no merge, no hidden
 *      defaults. What you read below is exactly what runs.
 *    - Everything is explicit and laid out top-to-bottom so you can see and
 *      change every knob in one place.
 *    - The three top-level constants (instanceId / routePrefix /
 *      componentPrefix) drive the nav tree, routes, and component paths.
 *      Change them once at the top and the literals below follow.
 *    - The only thing pulled from the framework is the component REGISTRY
 *      (`defaultVueComponents`) — 30+ boilerplate SFC paths you rarely touch.
 * ============================================================================
 */
import { defaultVueComponents, findHostnamePortProtocol } from 'ConfigUtils'

// ----------------------------------------------------------------------------
//  Top-level constants — the nav tree / routes / components are built from these
// ----------------------------------------------------------------------------
// The id of THIS app's default island (the webserver that served this page).
const instanceId      = "default"
// Prefix prepended to every route `location` (use a CDN root, or "" for local).
const routePrefix     = ""
// Prefix prepended to every component path (use a CDN root, or "" for local).
const componentPrefix = ""

// Connection info derived from the browser location (used by islands below).
const { hostname, protocol, isSecure } = findHostnamePortProtocol()

// ----------------------------------------------------------------------------
//  The entire application config — one explicit object, created once at load.
// ----------------------------------------------------------------------------
export default {

    // ========================================================================
    // App
    // ========================================================================
    // Development mode (extra logging / dev-only UI).
    isDev: true,
    /**
     * Cross-origin credentials. When true the browser sends cookies / HTTP auth
     * with requests and may store cookies from responses (server must opt in).
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
     */
    WITH_CREDENTIALS: false,

    // ========================================================================
    // Default Island (the server that served this page — HTTP, not websocket)
    // ========================================================================
    defaultInstanceId: "default",
    instanceId: instanceId,
    type: "IslandDefault",

    // Main application entry component (contains <RouterView/>).
    appMainComponent: "/core/PageMain.vue",
    // Base URL used to request app components/files (empty = same origin).
    appEndpoint: "",

    // ========================================================================
    // Layout
    // ========================================================================
    showSidebar: false,

    // ========================================================================
    // Components
    // ========================================================================
    // Whether components render expanded by default.
    componentsDefaultExpand: true,
    // Prefix applied when building the default component paths (usually "").
    componentPrefix: componentPrefix,

    // ========================================================================
    // Navigation
    // ========================================================================
    appName: "C0ckp1t Application",
    showTopNavBar: true,
    navAutoCollapse: false,
    navItems: [],
    navHasSearch: false,
    navHasThemeSel: false,

    // ========================================================================
    // Footer
    // ========================================================================
    showFooter: true,

    // ========================================================================
    // Documentation
    // ========================================================================
    showDocNav: true,
    showDocReload: true,
    showDocTrail: false,
    allowDocWrite: true,
    allowDocReload: true,

    // ========================================================================
    // Router
    // ========================================================================
    // true  -> createWebHashHistory (URLs use #)
    // false -> createWebHistory
    vueRouterModeIsHash: true,
    // Prefix applied when building the default routes (usually "").
    routePrefix: routePrefix,

    // ========================================================================
    // Logging (see core/Logging.mjs)
    // ========================================================================
    defaultLogLevel: "INFO",
    defaultLoggerLevels: {
        "GlobalStore.mjs": "INFO",
        "VueUtils.mjs": "INFO",
        "Connection.mjs": "INFO",
        "default": "INFO",
        "anonymous": "INFO",
        "admin": "INFO",
        "demo": "INFO"
    },

    // ========================================================================
    // Theming
    // ========================================================================
    bootswatchURL: "https://cdn.jsdelivr.net/npm/bootswatch@5.3.8/dist",

    // ========================================================================
    // Sidebar Navigation Tree (root)
    // ------------------------------------------------------------------------
    // Static literal. Endpoints are built from `instanceId` above. Add / remove
    // nodes here to change the sidebar. Each node:
    //   { icon, depth, endpoint, isLeaf, isRoot, path:[...], name, children:[...] }
    // ========================================================================
    root: {
        icon: "fa-house",
        depth: 0,
        endpoint: "/",
        isLeaf: false,
        isRoot: true,
        name: "",
        path: [],
        children: [
            {
                depth: 1,
                endpoint: `/${instanceId}/connections`,
                isLeaf: true,
                isRoot: false,
                path: ["connections"],
                name: "Connections",
                children: []
            },
            {
                depth: 1,
                endpoint: `/${instanceId}/cache`,
                isLeaf: true,
                isRoot: false,
                path: ["cache"],
                name: "Cache",
                children: []
            },
            {
                icon: "fa-network-wired",
                depth: 1,
                endpoint: `/${instanceId}/traffic`,
                isLeaf: true,
                isRoot: false,
                path: ["traffic"],
                name: "Traffic",
                children: []
            },
            {
                icon: "fa-bell",
                depth: 1,
                endpoint: `/${instanceId}/notifies`,
                isLeaf: true,
                isRoot: false,
                path: ["notifies"],
                name: "Notifies",
                children: []
            },
            {
                icon: "fa-info",
                depth: 1,
                endpoint: `/${instanceId}/docs`,
                isLeaf: true,
                isRoot: false,
                path: ["docs"],
                name: "Documentation",
                children: []
            },
            {
                icon: "fa-info",
                depth: 1,
                endpoint: `/${instanceId}/components`,
                isLeaf: true,
                isRoot: false,
                path: ["components"],
                name: "Components",
                children: [
                    {
                        icon: "fa-info",
                        depth: 2,
                        endpoint: `/${instanceId}/components/bootstrap`,
                        isLeaf: true,
                        isRoot: false,
                        path: ["bootstrap"],
                        name: "Bootstrap",
                        children: []
                    },
                    {
                        icon: "fa-info",
                        depth: 2,
                        endpoint: `/${instanceId}/components/basic`,
                        isLeaf: true,
                        isRoot: false,
                        path: ["basic"],
                        name: "Basic",
                        children: []
                    },
                    {
                        icon: "fa-info",
                        depth: 2,
                        endpoint: `/${instanceId}/components/advanced`,
                        isLeaf: true,
                        isRoot: false,
                        path: ["advanced"],
                        name: "Advanced",
                        children: []
                    },
                    {
                        icon: "fa-info",
                        depth: 2,
                        endpoint: `/${instanceId}/components/theme`,
                        isLeaf: true,
                        isRoot: false,
                        path: ["theme"],
                        name: "Theme",
                        children: []
                    },
                ]
            }
        ]
    },

    // ========================================================================
    // Vue Router Routes
    // ------------------------------------------------------------------------
    // Static literal. Paths use `instanceId`; each `location` uses `routePrefix`.
    // Add your own pages here.
    // ========================================================================
    routes: [
        { path: '/', name: 'root', children: [
            { path: '', redirect: `/${instanceId}/docs/Introduction.md` },
            { path: `${instanceId}`, children: [
                { path: 'docs', redirect: `/${instanceId}/docs/Introduction.md` },
                { path: 'docs/:pathMatch(.*)*', location: `${routePrefix}/core/pages/Documentation.vue` },
                { path: 'connections', location: `${routePrefix}/core/pages/Connections.vue` },
                { path: 'connections/:id', location: `${routePrefix}/core/pages/Connection.vue` },
                { path: 'cache', location: `${routePrefix}/core/pages/Cache.vue` },
                { path: 'traffic', location: `${routePrefix}/core/pages/Traffic.vue` },
                { path: 'notifies', location: `${routePrefix}/core/pages/Notifies.vue` },
                { path: 'components', location: `${routePrefix}/core/pages/frontend/Components.vue`, children: [
                    { path: 'basic', location: `${routePrefix}/core/pages/frontend/ComponentsBasic.vue` },
                    { path: 'advanced', location: `${routePrefix}/core/pages/frontend/ComponentsAdv.vue` },
                    { path: 'theme', location: `${routePrefix}/core/pages/frontend/Theme.vue` },
                    { path: 'bootstrap', location: `${routePrefix}/core/pages/frontend/Bootstrap.vue` },
                ]},
            ]}
        ]},
        { path: '/:pathMatch(.*)*', name: '404', location: `${routePrefix}/core/Page404.vue` }
    ],

    // ========================================================================
    // Components — built-in SFC registry (framework boilerplate).
    // ========================================================================
    components: defaultVueComponents(componentPrefix),

    // ========================================================================
    // Islands — additional backends registered automatically on startup.
    // Each island is an independent service/connection. Remove any you don't
    // need, or add your own following the same shape.
    // ========================================================================
    islands: [
        {
            instanceId: "admin",
            type: "Island",
            appEndpoint: "",
            isDev: true,
            WITH_CREDENTIALS: false,
            connection: {
                readOnly: true,
                hostname: hostname,
                port: 1995,
                protocol: protocol,
                endpoint: "socket",
                username: "root",
                password: "root",
                isSecure: isSecure,
            }
        },
        {
            instanceId: "anonymous",
            type: "Island",
            appEndpoint: "",
            isDev: true,
            WITH_CREDENTIALS: false,
            connection: {
                readOnly: true,
                hostname: hostname,
                port: 1995,
                protocol: protocol,
                endpoint: "socket",
                username: "anonymous",
                password: "anonymous",
                isSecure: isSecure,
            }
        },
    ],

}
