<script setup>
/*
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, markRaw, onMounted, ref, defineAsyncComponent, watch} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

import P1tEvent from "./sfc/p1t-event-.vue";
import { fromByteArray, eventBus} from 'WsUtils'

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'alert-offcanvas.vue'
const logger = getLogger(LOG_HEADER)

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const MAXIMUM_EVENTS = 16
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  events: [],
})

const itemRef = ref(null)

// ________________________________________________________________________________
// API
// ________________________________________________________________________________
function clearEvents() {
  eventBus.all.clear()
}

/**
 * pkt = {
 *  args: Array []
 *  bytes: Uint8Array(94) [ 123, 34, 101, … ]
 *  code: "EVENT"
 *  endpoint: "/wf/15"
 *  id: 0
 * }
 * data class ConnectedNotify(
 *     val endpoint: String,
 *     val type: String,
 *     val message: String,
 *     val kv: MutableMap<String, String> = mutableMapOf(),
 *     val createdMs: Long = System.currentTimeMillis()
 * )
 * @param type - usually the endpoint i.e. /wf/15
 * @param pkt
 * @returns {Promise<void>}
 */
async function handleEvent(type, pkt) {
  logger.debug(`[handleEvent] - type=${type} - pkt=${JSON.stringify(pkt)}`)
  let result = null
  try {
    const message = fromByteArray(pkt.bytes)
    logger.debug(`[EVENT] - ${message}`)
    result = JSON.parse(message)
  } catch (e) {
    logger.error(`[handleEvent] - Error processing event: ${e}`)
    result = {
      "endpoint": type,
      "type": "UNEXPECTED_ERROR",
      "message": e.message,
      "kv": {
        pkt: JSON.stringify(pkt)
      },
      "createdMs": Date.now()
    }
  }

  local.events.unshift(result)
  // If the buffer exceeds the set size, remove the oldest item
  if (local.events.length > MAXIMUM_EVENTS) {
    local.events.pop()
  }
  storeMain.offCanvasText = local.events.length
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
function close() {
  storeMain.offCanvas?.hide()
  storeMain.OffCanvasOpen = false
}

onMounted(() => {
  storeMain.offCanvas = markRaw(new bootstrap.Offcanvas(itemRef.value))
})

</script>


<template>
  <div ref="itemRef" class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" data-bs-scroll="true"
       data-bs-backdrop="false" aria-labelledby="offcanvasRightLabel">

    <div class="offcanvas-header">
      <ExecButton icon="fa fa-xmark " class="btn btn-warning btn-sm" :callback="() => close()"></ExecButton>
    </div>

    <div class="offcanvas-body">


<!--      <ExecButton icon="fa-rocket me-1" :callback="() => simulateEvent()"></ExecButton>-->
      <div v-for="(task, i) in local.events" :key="task.id">
        <P1tEvent :event="task"></P1tEvent>
      </div>
      <div v-if="local.events.length === 0" class="text-center text-white">
        No events to display.
      </div>

    </div>
  </div>
</template>


<style scoped>
.offcanvas {
  width: 50%;
  background-color: var(--bs-dark-bg-subtle);
}

.offcanvas-end {
  top: 0;
  right: 0;
  width: 50vw;
}
</style>

