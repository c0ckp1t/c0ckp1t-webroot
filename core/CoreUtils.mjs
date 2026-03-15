/**
 * Use window to extract the hostname, port, protocol, and whether the connection is secure.
 * @returns {{hostname: string, port: string, protocol: string, isSecure: boolean}}
 */
export function findHostnamePortProtocol() {
    const hostname = window.location.hostname
    const protocol = window.location.protocol.toLowerCase()
    const isSecure = protocol.toLowerCase() === 'https:'
    const port = window.location.port || (isSecure ? "443" : "80")
    const serverUrl = `${protocol}//${hostname}:${port}`
    return {hostname, port, protocol, isSecure, serverUrl}
}

// ________________________________________________________________________________
// Island Configuration
// ________________________________________________________________________________
/**
 * Validate and set defaults for the island config object.
 * @param config
 * @returns {*}
 */
export function validateIslandConfig(config) {
    if (!config) {
        throw new Error("Island config is required")
    }
    if (typeof config !== 'object') {
        throw new Error("Island config must be an object must was `" + typeof config + "`")
    }
    if (typeof config.instanceId !== `string` || config.instanceId.trim() === ``) {
        throw new Error(`Island config requires non-empty instanceId property`)
    }
    config.type ??= "LOCAL"

    if (!Array.isArray(config?.routes) || config.routes.length === 0) {
        config.routes = []
    }

    return config
}

// ________________________________________________________________________________
// Application Configuration
// ________________________________________________________________________________
export const DEFAULTS = {
    isDev: true,
    // XMLHttpRequest from a different domain cannot set cookie values for their own
    // domain unless withCredentials is set to true before making the request.
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
    WITH_CREDENTIALS: false,

    defaultInstanceId: "default",
    instanceId: "default",
    type: "LOCAL",
    // Determines GlobalStore.name
    appName: "C0ckp1t Application",
    // Used for default routes prefix (used only in config)
    routePrefix: "",
    // Used for default components prefix (used only in config)
    componentPrefix: "",
    // Main entry point
    appMainComponent: "/core/PageMain.vue",
    // Used for requestion app components and files (GlobalStore.appEndpoint)
    appEndpoint: "",

    // Nav Configuration
    navCloseLogo: "/core/img/logo_v1.svg",
    navOpenLogo: "/core/img/logo_v2.svg",
    navHasSearch: false,
    navHasThemeSel: true,

    // Determine if VueRouter is createWebHashHistory or createWebHistory
    vueRouterModeIsHash: true,

    // Logger Config (see Logging.mjs)
    defaultLogLevel: "INFO",
    defaultLoggerLevels: {
        "GlobalStore.mjs": "INFO",
        "VueUtils.mjs": "INFO",
        "Connection.mjs": "INFO",
        "default": "INFO",
        "anonymous": "INFO",
        "demo": "INFO"
    },


    bootswatchURL: "https://cdn.jsdelivr.net/npm/bootswatch@5.3.8/dist",
};


/**
 * Validate and set defaults for the config object.
 * @param config
 * @returns {*}
 */
export function validateAppConfig(config) {
    if (!config) {
        throw new Error("config is required")
    }
    if (typeof config !== 'object') {
        throw new Error("Config must be an object must was `" + typeof config + "`")
    }
    if (!Array.isArray(config?.routes) || config.routes.length === 0) {
        config.routes = []
    }
    if (typeof config.components !== 'object' || config.components === null) {
        config.components = {}
    }

    if (typeof config.instanceId !== `string` || config.instanceId.trim() === ``) {
        config.instanceId = DEFAULTS.instanceId
    }
    if (typeof config.type !== `string` || config.type.trim() === ``) {
        config.type = DEFAULTS.type
    }

    return config
}


// ________________________________________________________________________________
// Deep Merge Utility
// ________________________________________________________________________________
/**
 * Deep merge source into target. Returns a new object.
 * - Objects are recursively merged (source keys override target keys)
 * - Arrays are replaced entirely (source array wins)
 * - Scalars are replaced (source wins)
 */
export function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        const sourceVal = source[key];
        const targetVal = target[key];
        if (
            sourceVal !== null &&
            typeof sourceVal === 'object' &&
            !Array.isArray(sourceVal) &&
            targetVal !== null &&
            typeof targetVal === 'object' &&
            !Array.isArray(targetVal)
        ) {
            result[key] = deepMerge(targetVal, sourceVal);
        } else {
            result[key] = sourceVal;
        }
    }
    return result;
}