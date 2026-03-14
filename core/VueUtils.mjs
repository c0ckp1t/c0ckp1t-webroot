//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
/*
  VueUtils.mjs

  Simplified version that:
  1. Exports Vue and VueRouter for the main app
  2. Creates the shared router (used by both local app and islands)
  3. Provides local app sfc-loader options (for app/ directory)
  4. Delegates island management to IslandManager in DefaultRegistry.mjs

  The vue3-sfc-loader is still used for the local app, but islands can
  choose between 'sfc' mode (uses vue3-sfc-loader) or 'compiled' mode
  (uses native ES module imports).
*/
import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import {loadModule, vueVersion} from 'vue3-sfc-loader'

import * as Logging from "Logging";
import * as GlobalStore from 'GlobalStore'
import * as JsUtils from "JsUtils";
import * as NotifyUtils from "NotifyUtils";
import * as WsUtils from "WsUtils";

const katexTags = ['mn', 'mfrac', 'mrow', 'annotation', 'semantics', 'math',
    'mi', 'mo', "mtext", "msub", "mspace", "msup", "mover", "munder", "msqrt",
    'mtr', 'mstyle', 'mtd', 'mtable', 'munderover', 'msubsup'
]

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = `VueUtils.mjs`
const logger = Logging.getLogger(LOG_HEADER)
logger.debug("INIT")
logger.info(`vue3-sfc-loader vue version ${vueVersion}`)
logger.info(`vue.js version ${Vue.version}`)

function validateVueSFC(text) {
    if(text.startsWith("<!DOCTYPE html")) {
       throw Error(`[validateVueSFC] - Invalid SFC content: starts with !DOCTYPE html - likely an error page or non-SFC content`)
    }
   // if(!text.includes("<template>") || !text.includes("<script>")) { }
}
//________________________________________________________________________________
// LOCAL APP SFC LOADER OPTIONS
//________________________________________________________________________________
// Configuration passed to vue3-sfc-loader's loadModule
const options =  {
    devMode: false,
    // separate, custom cache of raw source text
    sourceCode: {},
    // ADD THIS:
    log(type, ...args) {
        if (type === 'error') {
            logger.error('[SFC]', ...args);
            console.error('[SFC LOADER ERROR]', ...args);
        } else if (type === 'warn') {
            logger.warn('[SFC]', ...args);
        } else {
            logger.info('[SFC]', ...args);
        }
    },

    // vue3-sfc-loader's cache
    moduleCache: {
        vue: Vue,
        "vue-router": VueRouter,
        JsUtils: JsUtils,
        WsUtils: WsUtils,
        Logging: Logging,
        NotifyUtils: NotifyUtils,
        GlobalStore: GlobalStore,
    },

    // Step 1. Fetch the file content
    async getFile(path) {

        const instanceId = JsUtils.substrAfterFirstSlash(path)

        let res = null
        if(sourceCode[path]) {
            logger.debug(`[getFile] - cached - ${path}`)
            const cached = sourceCode[path];
            res = new Response(cached.code, {status: 200, statusText: 'OK'});
        } else if (path.startsWith("http") || path.startsWith("HTTP")) {
            logger.debug(`[getFile] - http - ${path}`)
            res = await GlobalStore.store.r["default"].resolver(path)
        } else if (GlobalStore.store.r[instanceId]) {
            logger.debug(`[getFile] - instance - ${path}`)
            const pathAfterInstanceId = path.replace("/" + instanceId, "")
            res = await GlobalStore.store.r[instanceId].resolver(pathAfterInstanceId)
        } else {
            logger.debug(`[getFile] - default - ${path}`)
            res = await GlobalStore.store.r["default"].resolver(path)
        }

        return {
            getContentData: asBinary => {
                if (asBinary) {
                    return res.arrayBuffer();
                } else {
                    return res.text().then(text => {
                        if(path.endsWith(".vue")) {
                            validateVueSFC(text)
                        }
                        cacheSourceCode(path, text);
                        return text;
                    });
                }
            }
        }
    },

    addStyle(textContent) {
        logger.trace(`[addStyle]`)
        const style = Object.assign(document.createElement('style'), {textContent});
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },

    // Step 2. Handle the module request
    //  built-in handling for .vue, .js, .mjs, .css (return undefined)
    handleModule: async function (type, getContentData, path, options) {
        // type=.vue  - path=/core/PageMain.vue
        logger.debug(`[handleModule] - type=${type}  - path=${path}`)

        // Handle esm.sh external modules (used by code-mirror.vue)
        if (path.startsWith('https://esm.sh/')) {
            return import(path);
        }

        switch (type) {
            case '.png':
                return getContentData(true).then(buffer => {
                    const bytes = new Uint8Array(buffer);
                    let binary = '';
                    for (let i = 0; i < bytes.byteLength; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    return  'data:image/png;base64,' + btoa(binary);
                });
            case '.svg':
                return getContentData(true).then(arrayBuffer => {
                    const blob = new Blob([arrayBuffer], { type: 'image/svg+xml' });
                    return URL.createObjectURL(blob);
                });
            case '.json':
                return getContentData(false).then(text => {
                    return  JSON.parse(text)
                });
        }
    },

    isCustomElement: (tag) => {
        return tag === 'json-viewer' || katexTags.includes(tag);
    }
}

//________________________________________________________________________________
// LAZY-LOADED MODULE CACHE ENTRIES
//   Uses dynamic import() which resolves via the browser's import map.
//   vue3-sfc-loader handles promises in moduleCache, so on first access
//   the getter fires, triggers import(), caches the resolved module,
//   and returns the promise.
//________________________________________________________________________________
const lazyModules = ['json-viewer', 'idb-keyval', 'mitt', 'wavesurfer', 'msgpack', 'xstate']
for (const name of lazyModules) {
    Object.defineProperty(options.moduleCache, name, {
        get() {
            // On first access, delete the getter and replace with the promise from import()
            delete options.moduleCache[name]
            const promise = import(name).then(m => {
                options.moduleCache[name] = m.default ?? m
                return options.moduleCache[name]
            })
            options.moduleCache[name] = promise
            return promise
        },
        configurable: true,
        enumerable: true,
    })
}


//________________________________________________________________________________
// SOURCE CODE CACHING
//________________________________________________________________________________
async function cacheSourceCode(url, text) {
    const sha1 = await JsUtils.sha1(text)
    options.sourceCode[url] = {
        sha1: sha1,
        isWs: true,
        isCached: false,
        code: "Not Saving"
    }
}

/**
 * TODO: note there is only 1 loadModule, the default one above
 * Transforms a route configuration object into Vue Router compatible routes
 * @param {Function} loadModule - Function to load Vue components
 * @param {Array} routeConfigs - Array of route configuration objects
 * @returns {Array} - Vue Router compatible routes array
 */
export function transformRoutes(loadModule, routeConfigs) {
    if (!Array.isArray(routeConfigs)) {
        throw Error(`[transformRoutes] - routeConfigs is not an array`)
    }
    return routeConfigs.map(route => {
        const transformedRoute = {
            path: route.path,
        };

        // Add component (lazy-loaded via loadModule)
        if (route.location) {
            transformedRoute.component = () => loadModule(route.location);
        }

        // Add optional properties if they exist
        const optionalProps = ['name', 'meta', 'redirect', 'alias', 'props', 'beforeEnter'];
        optionalProps.forEach(prop => {
            if (route[prop] !== undefined) {
                transformedRoute[prop] = route[prop];
            }
        });

        // Recursively transform children if they exist
        if (route.children && route.children.length > 0) {
            transformedRoute.children = transformRoutes(loadModule, route.children);
        }

        return transformedRoute;
    });
}

//________________________________________________________________________________
// EXPORT
//________________________________________________________________________________
export {
    loadModule,
    options,
}
export const sourceCode = options.sourceCode;
