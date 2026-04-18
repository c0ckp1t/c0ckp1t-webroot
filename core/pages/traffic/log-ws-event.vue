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
const LOG_HEADER = 'log-ws-event.vue'
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

const event = computed(() => {
  try {
    const pkt = props.v?.out[0]
    if (pkt) {
      return fromBinary(pkt.bytes)
    } else {
      return null
    }
  } catch(e) {
    return null
  }
})

</script>


<template>
  <div class="log-ws-exec">

    <div class="row">
      <div class="col-auto">
        <x-label :isCompact="true" k="type"> {{ props.v.type }}</x-label>
      </div>
      <div class="col-auto">
        <x-label :isCompact="true" k="id"> {{ props.v.id }}</x-label>
      </div>
      <div class="col-auto">
        <x-label :isCompact="true" k="endpoint"> {{ props.v.endpoint }}</x-label>
      </div>
    </div>

    <h5 class="mt-2 mb-2">WsPacket.bytes (ConnectedNotify) = </h5>
    <x-json :expanded="true" :obj="event"/>


    <x-section :level="5" k="Log Entity" :visible="false">
      <x-json :expanded="true" :obj="props.v"/>
    </x-section>

  </div>
</template>


<style scoped>


</style>
