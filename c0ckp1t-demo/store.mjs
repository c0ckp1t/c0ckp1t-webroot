/*
  [VARS] - dashboards, endpoint, extra-api, import, init, store, instanceId, events
  Usage:
    import {api as apiLocal, store as storeLocal} from "/v3/workflows/wf/www/store.mjs";
*/
// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import {reactive, watch, computed, markRaw} from 'vue'
import {api as notify} from "NotifyUtils"
import {getLogger} from "Logging";
import {store as storeMain, api as apiMain} from 'GlobalStore'

// !# C0CKP1T_START import
import C0ckp1tConfig from "./Config.mjs";
// !# C0CKP1T_END import

export const instanceId = C0ckp1tConfig.instanceId
export const registry = storeMain.r[instanceId]
export const routerEndpoint = `/${instanceId}`

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "c0ckp1t-demo/store.mjs"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// STORE
// ________________________________________________________________________________
const MAXIMUM_EVENTS = 16

export const store = reactive({
  id: LOG_HEADER,
  isLoading: false,
  isReady: true,
  endpoint: routerEndpoint,

// !# C0CKP1T_START store
  islandDir: C0ckp1tConfig.islandDir,
// !# C0CKP1T_END store
})

// ________________________________________________________________________________
// API - PRIVATE
// ________________________________________________________________________________
function handleEvent(pkt) {
  const message = fromByteArray(pkt.bytes)
  logger.debug(`[EVENT] - ${message}`)

  const result = JSON.parse(message)
  store.events.unshift(result)

  // If the buffer exceeds the set size, remove the oldest item
  if (store.events.length > MAXIMUM_EVENTS) {
    store.events.pop()
  }
// !# C0CKP1T_START events

// !# C0CKP1T_END events
}

// ________________________________________________________________________________
// API - PUBLIC
// ________________________________________________________________________________
export const api = {
// !# C0CKP1T_START extra-api

// !# C0CKP1T_END

  // ________________________________________________________________________________
  // INIT
  // ________________________________________________________________________________
  async init() {
    logger.debug(`[INIT] - ${store.endpoint}`)
// !# C0CKP1T_START init

// !# C0CKP1T_END
  }

} // end of api

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (registry.state.isReady) {
    api.init()
  } else {
    setTimeout(async () => { await init() }, 1000)
  }
}
init()
