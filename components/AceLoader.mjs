/**
 * AceLoader.mjs
 *
 * Lazy-loads the Ace editor by dynamically injecting a <script> tag.
 * Returns a Promise that resolves to window.ace once the script is loaded.
 * Multiple callers share the same promise (no duplicate script tags).
 */
import {store as storeMain, api as apiMain} from 'GlobalStore'
let _promise = null

const ACE_SCRIPT_LOCAL = '/js_ext/ace-editor/ace.js'
const ACE_SCRIPT_CDN   = 'https://cdn.jsdelivr.net/npm/c0ckp1t@latest/js_ext/ace-editor/ace.js'

/**
 * @returns {Promise<typeof ace>}
 */
export function loadAce() {
    // Already on the page (e.g. loaded via static <script> during development)
    if (typeof ace !== 'undefined') return Promise.resolve(ace)

    // Reuse in-flight / resolved promise
    if (_promise) return _promise

    const componentPrefix = storeMain.appConfig?.componentPrefix || ""
    const src = `${componentPrefix}${ACE_SCRIPT_LOCAL}`

    _promise = new Promise((resolve, reject) => {
        const script  = document.createElement('script')
        script.src    = src
        script.type   = 'text/javascript'
        script.onload = () => {
            if (typeof ace !== 'undefined') {
                resolve(ace)
            } else {
                reject(new Error('[AceLoader] ace global not found after script load'))
            }
        }
        script.onerror = () => {
            _promise = null // allow retry
            reject(new Error(`[AceLoader] Failed to load ${src}`))
        }
        document.head.appendChild(script)
    })

    return _promise
}
