// ============================================================================
//  ConfigUtils.mjs
// ----------------------------------------------------------------------------
//  Framework configuration HELPERS ONLY.
//
//  This file intentionally contains NO application configuration and NO
//  default config object. The application configuration lives entirely in a
//  single, explicit file: `config.mjs` (copied from `config.default.mjs`).
//
//  There are exactly three exports here — nothing more should be added:
//
//    1. defaultVueComponents(prefix)  -> the built-in SFC component registry
//    2. validateAppConfig(config)     -> validates a config object (throws)
//    3. findHostnamePortProtocol()    -> derives connection info from window
//
//  Do NOT reintroduce DEFAULTS / deepMerge / createConfig / buildNavTree /
//  buildRoutes here. The config is a single hand-written object; if you need
//  to change nav/routes/options, edit `config.mjs` directly.
// ============================================================================

// ============================================================================
//  Components Registry
// ============================================================================
/**
 * Return the built-in C0ckp1t Vue component registry (path + sha1 hash).
 *
 * This is framework boilerplate — the same 30+ components ship with every
 * app — so it stays here instead of being copied into every `config.mjs`.
 * `config.mjs` calls this once: `components: defaultVueComponents(componentPrefix)`.
 *
 * @param {string} prefix - Base URL/path prefixed to every component path
 *                          (e.g. a CDN root). Use "" for same-origin.
 * @returns {Object} map of componentName -> { path, hash }
 */
export function defaultVueComponents(prefix = "") {
    return {
        ExecButton: {path: `${prefix}/components/ExecButton.vue`, hash: `97e3d2ce89808c5a69f41404e1337f743015f0cc`},
        XInput: {path: `${prefix}/components/xinput.vue`, hash: `cd47d7d038316367df6fd7e265aa3625b72a7777`},
        XInput2: {path: `${prefix}/components/xinput2.vue`, hash: `320e52ac991baebded7c2a9f52a4cfc2cde47b55`},
        XLabel: {path: `${prefix}/components/xlabel.vue`, hash: `90a9837aa8e06f1d3a5b7601337afd78a872d181`},
        XDropdown: {path: `${prefix}/components/xdropdown.vue`, hash: `52b29b72fd6512eefccd9caa76e26dd91d9f9f9e`},
        XDropdown2: {path: `${prefix}/components/xdropdown2.vue`, hash: `e7b163eda42fb7e1a6f07b011c423f8f275eb65d`},
        XSection: {path: `${prefix}/components/xsection.vue`, hash: `27285d606f57d13f80156bb11cd34449f88df950`},
        XTableOpen: {path: `${prefix}/components/xtable-open.vue`, hash: `a1b9a4f670817978022a4c596e2e2f89dd4568c2`},
        XCollapse: {path: `${prefix}/components/xcollapse.vue`, hash: `ba1479bd1080a4fa5abdf6c91c7328ae679f78e6`},
        XToggle: {path: `${prefix}/components/xtoggle.vue`, hash: `2f6871d2d3069ac8f35b6bf76de6c2109f42d9d1`},
        XToggle3: {path: `${prefix}/components/xtoggle3.vue`, hash: `61d0464e6ed9983e817eb0cde928dceb7c0fdc75`},
        XCheck: {path: `${prefix}/components/xcheck.vue`, hash: `ee0d6b30600fb41589123f6d66f2791f1332d4f7`},
        XCheckbox: {path: `${prefix}/components/xcheckbox.vue`, hash: `a290c0cbb7bffce83c235dd5a1c98ed9c441a5b0`},
        XTextarea: {path: `${prefix}/components/xtextarea.vue`, hash: `f8bb08419082aa5443630ab07172674b50c7a248`},
        XHidden: {path: `${prefix}/components/xhidden.vue`, hash: `ecb396e12dd894040e715c0854275e4d5016fcb9`},
        XCode: {path: `${prefix}/components/xcode.vue`, hash: `4d9d9165fea0539c9a983fcdffae8dedcfd537ae`},
        XCodeSlot: {path: `${prefix}/components/xcode-slot.vue`, hash: ``},
        XButton: {path: `${prefix}/components/xbutton.vue`, hash: `2e956caa47e46377ea5a809f7438d0fc38be73b9`},
        XTabs: {path: `${prefix}/components/xtabs.vue`, hash: `83dc219106bdc86ae86dcd16cf95ebd7f11bc952`},
        XKv: {path: `${prefix}/components/xkv.vue`, hash: `8951d3a5e3786cfc9c705b13c1f71e3f90dd2552`},
        XNav: {path: `${prefix}/components/xnav.vue`, hash: `8d51c73e5716deed3577652e362c50526ddbe4e1`},
        XMap: {path: `${prefix}/components/xmap.vue`, hash: `daee357d9e2ef96df0166dd7add0339d46a1cc01`},
        XList: {path: `${prefix}/components/xlist.vue`, hash: `217ced04a333238d169c300a721b75f0ddd5e95b`},
        XJson: {path: `${prefix}/components/xjson.vue`, hash: `0a3ef6265b4070b0f002d659776c02756cc1da5a`},
        XCard: {path: `${prefix}/components/xcard.vue`, hash: `de3fbb23ae7b00d4c90a717dd361cb9315e9ded6`},
        XCardH: {path: `${prefix}/components/xcard-h.vue`, hash: `de4d42f1056c5d2b8431f15e6b1180d9f9898ac2`},
        XColor: {path: `${prefix}/components/xcolor.vue`, hash: `9bf9497ff66e213277f17af290c21c0a35752510`},
        "v-ace-editor": {
            path: `${prefix}/components/vue3-ace-editor.vue`,
            hash: `70ce4a39152af5cf0f7cb6b1d4fdafc8b6225edc`
        },
        XMarkdown: {path: `${prefix}/components/xmarkdown.vue`, hash: `15f835547fab8a8c8aad47d72640c8e918a7b9da`},
        XMd: {path: `${prefix}/components/xmd.vue`, hash: ``},
        XSound: {path: `${prefix}/components/xsound.vue`, hash: `3e8ad4aa3c767f757dd49b99aa6f961547caf970`},
        XUpload: {path: `${prefix}/components/xupload.vue`, hash: `7a872277e0047fca11e950efe08f2bffa670abdb`},
        XTree: {path: `${prefix}/components/xtree.vue`, hash: `3b6534e86996c48ab05072a9b793ecc78d83a0eb`},
        CodeMirror: {path: `${prefix}/components/code-mirror.vue`, hash: `3ce1028adb75831e01c4264d5764c14f60a1bd00`},
        XTerminal: {path: `${prefix}/components/xterminal.vue`, hash: `1c01f92c0a08bd4937f9768a1d49f12a9a84feea`},
    }
}

// ============================================================================
//  Validation
// ============================================================================
/**
 * Validate an application config object.
 *
 * The config is written by hand in `config.mjs` and is expected to be
 * COMPLETE — this function does NOT fill in defaults or merge anything.
 * It simply asserts that the critical fields are present and well-typed,
 * failing fast (throwing) if the hand-written config is broken.
 *
 * The only mutation performed is coercing the optional array fields
 * (`navItems`, `islands`) to `[]` when omitted, so downstream code can
 * iterate them safely.
 *
 * @param {Object} config
 * @returns {Object} the same config (validated / lightly coerced)
 */
export function validateAppConfig(config) {
    if (!config || typeof config !== 'object') {
        throw new Error(`config must be an object but was \`${typeof config}\``)
    }

    // ---- required, non-empty string fields ----
    for (const key of ['instanceId', 'type', 'appMainComponent']) {
        if (typeof config[key] !== 'string' || config[key].trim() === '') {
            throw new Error(`config.${key} is required and must be a non-empty string`)
        }
    }

    // ---- required structures ----
    if (!Array.isArray(config.routes)) {
        throw new Error(`config.routes is required and must be an array`)
    }
    if (!config.root || typeof config.root !== 'object') {
        throw new Error(`config.root is required and must be an object (nav tree)`)
    }
    if (!config.components || typeof config.components !== 'object') {
        throw new Error(`config.components is required and must be an object`)
    }

    // ---- optional arrays: coerce so callers can iterate safely ----
    if (!Array.isArray(config.navItems)) {
        config.navItems = []
    }
    if (!Array.isArray(config.islands)) {
        config.islands = []
    }

    return config
}

/**
 * Validate and clean Island Configuration.
 * This guarantees that the structure of the island configuration is consistent
 * {
 *   "instanceId": string,
 *   "type": "Island",
 *   "appEndpoint": "",
 *   "isDev": true,
 *   "WITH_CREDENTIALS": false,
 *   "connection": {  // NULLABLE
 *     "readOnly": true,
 *     "hostname": "localhost",
 *     "port": 1995,
 *     "protocol": "http:",
 *     "endpoint": "socket",
 *     "username": "anonymous",
 *     "password": "anonymous",
 *     "isSecure": false
 *   },
 *   routes: [],
 *   root: {},
 *   "SERVER_API_URL": "http://localhost:1995",
 *   "isStored": false,
 *   "isRunning": true
 * }
 *
 */
export function validateAndCleanIslandConfig(config) {
    const env = findHostnamePortProtocol()
    // Start from input or empty object; guarantee it's an object
    const raw = (config && typeof config === 'object') ? config : {}

    // ---- top-level defaults ----
    const cleaned = {
        instanceId: typeof raw.instanceId === 'string' && raw.instanceId.trim() !== ''
            ? raw.instanceId.trim()
            : 'anonymous',
        type: raw.type === 'IslandDefault' ? 'IslandDefault' : 'Island',
        appEndpoint: typeof raw.appEndpoint === 'string' ? raw.appEndpoint : '',
        isDev: typeof raw.isDev === 'boolean' ? raw.isDev : true,
        WITH_CREDENTIALS: typeof raw.WITH_CREDENTIALS === 'boolean' ? raw.WITH_CREDENTIALS : false,
        SERVER_API_URL: typeof raw.SERVER_API_URL === 'string' && raw.SERVER_API_URL.trim() !== ''
            ? raw.SERVER_API_URL.trim()
            : env.serverUrl,
        routes: Array.isArray(raw.routes) ? raw.routes : [],   // preserved or default
        root: (raw.root && typeof raw.root === 'object') ? raw.root : {
            icon: "fa-house",
            depth: 0,
            endpoint: "/",
            isLeaf: false,
            isRoot: true,
            name: "",
            path: [],
            children: []
        },
    }

    const conn = (typeof raw.connection === 'object') ? raw.connection : {}
    cleaned.connection = {
        readOnly: typeof conn.readOnly === 'boolean' ? conn.readOnly : true,
        hostname: typeof conn.hostname === 'string' && conn.hostname.trim() !== ''
            ? conn.hostname.trim()
            : env.hostname,
        port: Number.isFinite(parseInt(conn.port, 10))
            ? parseInt(conn.port, 10)
            : (Number.isFinite(parseInt(env.port, 10)) ? parseInt(env.port, 10) : 1995),
        protocol: typeof conn.protocol === 'string' && conn.protocol.trim() !== ''
            ? conn.protocol.trim().toLowerCase()
            : env.protocol,
        endpoint: typeof conn.endpoint === 'string' && conn.endpoint.trim() !== ''
            ? conn.endpoint.trim()
            : 'socket',
        username: typeof conn.username === 'string' ? conn.username : 'anonymous',
        password: typeof conn.password === 'string' ? conn.password : 'anonymous',
    }
    cleaned.connection.isSecure = typeof conn.isSecure === 'boolean'
        ? conn.isSecure
        : (cleaned.connection.protocol === 'https:')


    cleaned.isStored = typeof raw.isStored === 'boolean' ? raw.isStored : false
    cleaned.isRunning = typeof raw.isRunning === 'boolean' ? raw.isRunning : false
    return cleaned
}

// ============================================================================
//  Environment
// ============================================================================
/**
 * Use `window.location` to derive hostname, port, protocol, TLS flag and a
 * fully-qualified server URL. Used by `config.mjs` to point island
 * connections at the server that served the page.
 *
 * @returns {{hostname: string, port: string, protocol: string, isSecure: boolean, serverUrl: string}}
 */
export function findHostnamePortProtocol() {
    const hostname = window.location.hostname
    const protocol = window.location.protocol.toLowerCase()
    const isSecure = protocol.toLowerCase() === 'https:'
    const port = window.location.port || (isSecure ? "443" : "80")
    const serverUrl = `${protocol}//${hostname}:${port}`
    return {hostname, port, protocol, isSecure, serverUrl}
}
