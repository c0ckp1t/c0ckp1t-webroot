// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
/*
    NotifyUtils.mjs
    Note: Reactive Component
    Usage:
    import {api as notify } from "NotifyUtils"

    function notifyGood() {
        notify.notifyGood("test good")
    }
    function notifyBad() {
        notify.notifyBad("test bad")
    }
    function displayHistory() {
        notify.displayHistory()
    }
    function clearNotify() {
        notify.clearNotify()
    }

*/
import { reactive } from 'vue'
import { eventBus } from 'WsUtils'
import {getLogger} from "Logging";

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'NotifyUtils.mjs'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// eventBus.on('/alert', (endpoint, pkt) => {
//     api.infoDetails(`endpoint="${endpoint}"`, pkt)
// })

export const NotifyType = {
    GOOD: "GOOD",
    BAD: "BAD",
    INFO: "INFO",
    EVENT: "EVENT",
}

const MAX_LOG_COUNT = 50
// const ACTIVE_TIME_MS = 2500 // time each message is shown
// const REST_TIME_MS = 550 // time between messsages if there are multiple
let notifyTimer = null

// Really confusion but the machinery is in toast.vue
// so wrong. It manipulates this data structure a

// ________________________________________________________________________________
// PRIVATE METHODS
// ________________________________________________________________________________
function buildNotifyDTO(type, message = "N/A", title = "N/A") {
    return {
        message: message,
        type: type,
        title: title
    }
}

// ________________________________________________________________________________
// NOTIFY STORE
//  This is a reactive vue component.
//  THis is part of the store, shouldn't be here.
// ________________________________________________________________________________
export const store = reactive({
    message: "default message",
    title: "default title",
    subtitle: "default title",
    type: NotifyType.GOOD,

    consumerRunning: false,
    notifyQueue: [], // why is this queue here? this should be in store?

    logIndex: 0,
    notifyLog: [],
    documentation: "/v3/text-markdown/c0ckp1t/vue-js/Notifications.md"
})

// ________________________________________________________________________________
// NOTIFY API
// ________________________________________________________________________________
export const api = {

    clearNotifyHistory() {
        store.notifyLog = []
    },

    // ________________________________________________________________________________
    // MESSAGE QUEUE
    // ________________________________________________________________________________
    async good(message) {
        const dto = buildNotifyDTO(NotifyType.GOOD, message, "Good")
        store.notifyQueue.push(dto)
    },
    async goodDetails(title, message) {
        const dto = buildNotifyDTO(NotifyType.GOOD, message, title)
        store.notifyQueue.push(dto)
    },
    async bad(message) {
        const dto = buildNotifyDTO(NotifyType.BAD, message, "Bad")
        store.notifyQueue.push(dto)
    },
    async badDetails(title, message) {
        const dto = buildNotifyDTO(NotifyType.BAD, message, title)
        store.notifyQueue.push(dto)
    },

    async info(message) {
        const dto = buildNotifyDTO(NotifyType.INFO, message, "Info")
        store.notifyQueue.push(dto)
    },

    async infoDetails(title, message) {
        const dto = buildNotifyDTO(NotifyType.INFO, message, title)
        store.notifyQueue.push(dto)
    },

    // ________________________________________________________________________________
    // EVENTS
    // ________________________________________________________________________________
    async event(endpoint, message) {
        const dto = buildNotifyDTO(NotifyType.EVENT, message, endpoint)
        store.notifyQueue.push(dto)
    },

    // ________________________________________________________________________________
    // ??
    // ________________________________________________________________________________
    async exec2Error(error, local) {
        const stdoutText = (error.stack?.toString() ?? "") + "\n" + (error.data?.stack?.toString() ?? "") + "\n"
        const dto = buildNotifyDTO(NotifyType.BAD, `${error.message} ${stdoutText}`, `exec2Error ${error.endpoint}`)
        store.notifyQueue.push(dto)
        local.isLoading = false
    },
    async exec2ErrorLoading(error, local) {
        const dto = buildNotifyDTO(NotifyType.BAD, `message=${error.message}`, `exec2ErrorLoading ${error.endpoint}`)
        store.notifyQueue.push(dto)
        local.stdoutText += "[ERROR HANDLER]\n"
        local.stdoutText += error.toString() + "\n"
        local.stdoutText += "[STACK]\n"
        local.stdoutText += (error.stack?.toString() ?? "") + "\n"
        local.stdoutText += (error.data?.stack?.toString() ?? "") + "\n"
        local.isLoading = false
    },
    exec2CompleteLoading(local) {
        local.isLoading = false
    },



    async lastMessage() {
        store.visible = true
        clearNotify(2 * clearTimeMs)
    },

    async log(notify) {
        store.notifyLog.push(notify)
        if (store.notifyLog.length > MAX_LOG_COUNT) {
            store.notifyLog.shift()
        }
    },

    // ________________________________________________________________________________
    // TEST HELPERS
    // ________________________________________________________________________________
    generateNotify: () => {
        logger.info("generateNotify()")
        api.good("good notify test")
        api.bad("bad notify test")
        api.info("info notify test")
    },
    generateClientEvent: () => {
        eventBus.emit('foo', { a: 'b' })
    }
}


