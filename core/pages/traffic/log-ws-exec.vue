<script setup>
/*
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, watch, onMounted, computed} from 'vue'
import {store as storeMain, api as methods} from 'GlobalStore'
import {getLogger} from "Logging"
import {toBinary, fromBinary, fromByteArray, Code2} from "WsUtils"

const $moment = storeMain.app.config.globalProperties.$moment;
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'log-ws-exec.vue'
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
  let resp = null
  let complete = null
  let error = null
  props.v.in.forEach(pkt => {
    if (pkt.code === Code2.EXEC_RESP) {
      resp = fromBinary(pkt.bytes)
      resp.result = tryJsonParse(resp.result)
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

function tryJsonParse(result) {
  try {
    return JSON.parse(result);
  } catch (error) {
    return result;
  }
}

function tryJsonParseRecursive(result) {
  try {
    const parsedJson = JSON.parse(result);
    for (let key in parsedJson) {
      if (typeof parsedJson[key] === 'string') {
        parsedJson[key] = recursiveJsonParse(parsedJson[key]);
      }
    }
    return parsedJson;
  } catch (error) {
    return dto;
  }
}
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
        <x-label :isCompact="true" k="type"> {{ props.v.type }}</x-label>
      </div>
      <div class="col-auto">
        <x-label :isCompact="true" k="args">{{ props.v.out[0].args }}</x-label>
      </div>
    </div>

    <div class="row container">

      <x-section :level="4" :k="exec.accept !== null ? 'ACCEPTED' : 'MISSING ACCEPT'" :visible="true">
        <span class="fw-bold pe-2">{{ exec.accept }}</span>
      </x-section>

      <x-section :level="4" :k="exec.resp !== null ? 'EXEC_RESP' : 'MISSING EXEC_RESP'" :visible="true">
        <x-json :expanded="true"  :obj="exec.resp"></x-json>
      </x-section>

      <x-section :level="4" :k="exec.complete !== null ? 'COMPLETED' : 'MISSING COMPLETE'" :visible="true">
        <span class="fw-bold text-success pe-2">{{ exec.complete }}</span>
      </x-section>

      <x-section :level="4" :k="exec.complete !== null ? 'COMPLETED' : 'MISSING COMPLETE'" :visible="true"
                 v-if="exec.error !== null">
        {{ exec.error }}
      </x-section>

      <x-section :level="5" k="Log Entity" :visible="false">
        <x-json :expanded="true" :obj="props.v"></x-json>
      </x-section>
    </div>
  </div>
</template>


<style scoped>


</style>
