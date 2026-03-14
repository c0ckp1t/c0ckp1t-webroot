/*
  Session.mjs
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {markRaw, reactive, watch, defineAsyncComponent, getCurrentInstance} from 'vue'
import {getLogger} from "Logging";
import {actions as wsAction, connStateString, isConnected, state, url} from "./WsInterface.mjs"

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'ws/Session.mjs'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")


// This watcher is needed because the Connection can be closed
//  unexpectedly. This updates the state-machine to match state of wsClient.
//  Ugly solution.
watch(
    () => isConnected.value,
    async (curr, prev) => {
        // NOTE: actor.send is idempotent
        if (!curr) {
            logger.info(`[WATCH] - WsInterface - isConnected=${curr}`)
            store.actor.send({type: 'c0ckp1t.disconnected'});
            store.isConnected = false
        } else {
            store.actor.send({type: 'c0ckp1t.connected'});
        }
    }
)

function loginValidateClientSide() {
    logger.debug(`[${store.id}] - loginValidateClientSide`)
    if (state.username < 3) {
        store.errorMessage = "UniqueId must have 3 or more characters"
        return false
    }
    if (state.password < 3) {
        store.errorMessage = "Password must have 3 or more characters"
        return false
    }
    return true
}





//________________________________________________________________________________
// Connection
// ________________________________________________________________________________
export default class Session {
    // ________________________________________________________________________________
    // CONSTRUCTOR
    // ________________________________________________________________________________
    constructor() {



    }

    // ________________________________________________________________________________
    // API
    // ________________________________________________________________________________


}

