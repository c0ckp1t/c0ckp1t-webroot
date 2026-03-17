/*
    WsLogUtils.mjs - Packet Logger for C0ckp1t
*/
// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import { reactive } from 'vue'
import {Code, toBinary, fromBinary, Code2} from "WsUtils"
import { getLogger } from "Logging"

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'WsLogUtils.mjs'
let logger = getLogger(LOG_HEADER)
logger.debug('INIT')

// ________________________________________________________________________________
// PRIVATE
// ________________________________________________________________________________
const MSG_HISTORY = 50

function buildHistObj(index, instanceId, pkt) {
    return {
        index: index,
        type: pkt.code,
        instanceId: instanceId,
        id: pkt.id,
        endpoint: pkt.endpoint,
        // startMs: Date.now(),
        in: [],
        out: [pkt]
    }
}

// ________________________________________________________________________________
// WsPacket HISTORY STORE
// ________________________________________________________________________________
export const store = reactive({
    history: [],
    enabled: true,
    instanceId: null,
    historyIdx: 0,
    idToIdxMap: {},
    documentation: "./docs/Frontend/Traffic.md",
})

// ________________________________________________________________________________
// METHODS
// ________________________________________________________________________________
// Convert from WsPacket.id to the store.historyIdx it is inserted into
function idToIndex(id) {
    return store.idToIdxMap[id]
}

// ________________________________________________________________________________
// NOTIFY API
// ________________________________________________________________________________
export const api = {

    async logInbound(id, wsPacket) {
        if (!store.enabled) return
        const idx = idToIndex(wsPacket.id)
        if(idx === undefined || idx === null) {
            logger.warn("id is empty or undefined. Unable to log inbound packet. wsPacket:", wsPacket)
            return
        }
        store.history[idx].in.push(wsPacket)
    },

    async logOutbound(id, wsPacket) {
        if (!store.enabled) return

        if (wsPacket.code === Code2.EXEC_REQ || wsPacket.code === Code2.EXEC2_REQ || wsPacket.code === Code2.EXEC3_REQ) {
            let idx = store.historyIdx
            store.history[idx] = buildHistObj(idx, id, wsPacket)
            store.idToIdxMap[wsPacket.id] = idx
            if (store.historyIdx > MSG_HISTORY) {
                store.historyIdx = 0
                const oldPktId = store.history[0]
                delete store.idToIdxMap[oldPktId]
            } else {
                store.historyIdx += 1
            }
        } else {
            logger.warn(`[LOG_OUTBOUND_ERROR] - unexpected wsPacket - ${wsPacket}`)
        }
    },
    async clearHistory() {
        for (var i = 0; i < MSG_HISTORY; ++i) {
            store.history[i] = buildHistObj(i)
        }
    },

    async addTestPkt() {
        await api.logOutbound("test-instance", {
            code: Code2.EXEC_REQ,
            id: `test-pkt-${Date.now()}`,
            endpoint: "/test/endpoint",
            bytes: null,
            args: ["test-arg1", "test-arg2"]
        })
    }

}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
    logger.debug(`INIT - history size: ${MSG_HISTORY}`)
}
init()