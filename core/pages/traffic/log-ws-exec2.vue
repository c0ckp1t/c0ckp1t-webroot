<script setup>
/*
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import { reactive, watch, onMounted, computed } from 'vue'
import {store as storeMain, api as methods} from 'GlobalStore'
import { getLogger } from "Logging"
import {toBinary, fromBinary, fromByteArray, Code2} from "WsUtils"

const $moment = storeMain.app.config.globalProperties.$moment;
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'log-ws-exec2.vue'
let logger = getLogger(LOG_HEADER)
logger.info('INIT')

// ________________________________________________________________________________
// PROPERTIES
// ________________________________________________________________________________
const props = defineProps({
  v: Object
})

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
})

const exec = computed(() => {
  let accept = null
  let resp = []
  let complete = null
  let error = null
  props.v.in.forEach( pkt => {
    if(pkt.code === Code2.EXEC2_RESP) {
      // resp.push(fromBinary(pkt.bytes))
      try {
        resp.push(fromByteArray(pkt.bytes))
      } catch {
        resp.push(`[CAUGHT_BINARY_DATA] - length=${pkt.bytes.length}`)
      }
    } else if (pkt.code === Code2.ACCEPT) {
      accept = "ACCEPT"
    } else if (pkt.code === Code2.COMPLETE) {
      complete = "COMPLETE"
    } else if (pkt.code === Code2.ERROR) {
      error = fromByteArray(pkt.bytes)
    } else {
      error = `[INVALID_CODE] - code=${pkt.code}`
    }
  })
  return {
    accept,
    resp,
    complete,
    error,
  }
})

// ________________________________________________________________________________
// EVENT METHODS
// ________________________________________________________________________________
function toggleVisible() {
  local.visible = !local.visible
}

</script>


<template>
  <div class="log-ws-exec">
    <div class="row">
      <div class="col-auto">
        {{props.v.type}}
      </div>
      <div class="col-auto">
        {{props.v.out[0].args}}
      </div>
    </div>
    <div class="row mt-2">
        <div v-if="exec.accept !== null">
          <span class="fw-bold pe-2">{{exec.accept}}</span>
        </div>
        <div v-else>
          MISSING ACCEPT
        </div>

        <div v-if="exec.resp !== null">
          <div class="row">
            <x-collapse k="EXEC_RESP">
              <x-json :obj="exec.resp"></x-json>
            </x-collapse>
          </div>
        </div>
        <div v-else>
          Missing EXEC_RESP
        </div>

        <div v-if="exec.complete !== null">
          <span class="fw-bold text-success pe-2">{{exec.complete}}</span>
        </div>
        <div v-else>
          MISSING COMPLETE
        </div>

      <div v-if="exec.error !== null">
        {{exec.error}}
      </div>
    </div>

    <div class="row mt-2">
      <x-collapse k="Log Entity">
        <x-json :obj="props.v"></x-json>
      </x-collapse>
    </div>
  </div>
</template>


<style scoped>


</style>
