
/*
    Usage:

    import {api as wsLog} from "NotifyUtils"


*/
// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import { reactive } from 'vue'
import {Code, toBinary, fromBinary, Code2} from "WsUtils"

const MSG_HISTORY = 50

function buildHistObj(index, instanceId, pkt) {
    return {
        index: index,
        type: pkt.code,
        instanceId: instanceId,
        id: pkt.id,
        endpoint: pkt.endpoint,
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
    documentation: "/v3/text-markdown/c0ckp1t/vue-js/Traffic.md"
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
    logInbound(id, wsPacket) {
        if (!store.enabled) return
        let idx = idToIndex(wsPacket.id)
        if(!idx) {
            console.log("TODO: fix logger for events")
            return
        }
        store.history[idx].in.push(wsPacket)
    },
    logOutbound(id, wsPacket) {
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
            return
            // Note: All messages are outbound first. C0ckp1t doesn't currently
            //  initiate any messages
            // console.log(`[LOG_OUTBOUND_ERROR] - unexpected wsPacket - ${wsPacket}`)
        }
    },
    async clearHistory() {
        for (var i = 0; i < MSG_HISTORY; ++i) {
            store.history[i] = buildHistObj(i)
        }
    }

}

