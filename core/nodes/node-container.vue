<script setup>
/*
  Usage: 
    const P1tLogger = defineAsyncComponent(() => import('/v2/reg/logger.vue'))
    
    const NodeContainer = defineAsyncComponent(() => import("/v2/reg/node-container.vue"))
    <node-container :node="local.node">
        <p1t-logger :endpoint="props.node.endpoint"></p1t-logger>
    </node-container>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {onMounted, defineAsyncComponent, reactive} from "vue"
import {store} from "GlobalStore"
import {getLogger} from "Logging"
// import {api as apiRegistry, store as storeRegistry} from "Registry";

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'node-container.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  isLoading: false,
  displayInfo: false,
  info: {}
})

// ________________________________________________________________________________
// PROPERTIES
// ________________________________________________________________________________
const props = defineProps({
  node: Object
})

async function findApiResources() {
  const args = ['info']
  const resp = await apiRegistry.exec(props.node.endpoint, args)
  logger.info(resp)
  if (!resp.isOk) {
    logger.info(`[API_ERROR] - [${local.id}] - findApiResources - ${resp.result}`)
    return
  }
  local.info = JSON.parse(resp.result)
}

function infoToggle() {
  local.displayInfo = !local.displayInfo
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (store.connected) {
    findApiResources()
  } else {
    setTimeout(async () => { await init() }, 1000) }
}

onMounted(async () => { init() })

</script>


<template>
  <div class="container">
    <div class="row mb-2">
      <div class="col">
        <x-label k="Endpoint">{{props.node.endpoint}}</x-label>
      </div>
      <div class="col-auto">
        <x-label k="Type">{{props.node.type}}</x-label>
      </div>
      <div class="col-auto">
        <x-button @click="infoToggle" icon="fa-info me-1" class="me-2" :isLoading="local.isLoading"
                  :extras="local.displayInfo  ? 'btn btn-success' : 'btn btn-dark'">
          API
        </x-button>
      </div>
    </div>

    <div class="row info" v-if="local.displayInfo">
      <x-label :isCompact="true" k="stack:">{{local.info.stack}}</x-label>
      <div v-for="f in local.info.functions">
        {{ f.name }}  - {{ f.params }}
      </div>
    </div>

    <slot></slot>
  </div>
</template>


<style scoped>
/* node-container.vue */
</style>
