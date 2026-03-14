<script setup>

// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, onMounted, onUnmounted, defineAsyncComponent, watch, computed} from 'vue'
import {store as storeMain} from 'GlobalStore'
import {getLogger} from "Logging";
import {groupObjectByProperty} from "JsUtils";

const props = defineProps({
  endpoint: String,
  instanceId: String
})

const registry = storeMain.r[props.instanceId]



// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'info-api.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,

  info: null,

})

const execByGroup = computed(() => {
  if(local.info === null) return []
  return groupObjectByProperty(local.info.functions, 'group')
})

// ________________________________________________________________________________
// API
// ________________________________________________________________________________
async function infoApi() {
  logger.debug(`[infoApi] - ${props.endpoint}`)
  const resp = await registry.exec(props.endpoint, ["infoApi"])
  if (!resp.isOk) {
    logger.error(`[respInfo] - ${resp.result}`)
    return
  }
  const result = JSON.parse(resp.result)
  logger.debug(result)
  local.info = result
}



// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (registry.state.isReady) {
    infoApi()
  } else {
    setTimeout(async () => { await init() }, 1000)
  }

}

onMounted(async () => { init() })



</script>


<template>
  <div class="api-info" v-if="local.info !== null">
    <div class="row">
      <div class="col-auto">
        <ExecButton icon="fa-rotate-right me-1"  :callback="() => infoApi()"></ExecButton>
      </div>
      <div class="col-auto">
        <x-label k="endpoint">{{ local.info.endpoint }}</x-label>
      </div>
    </div>


    <div class="functions">
      <h5 class="text-primary">execute</h5>

      <div class="mt-2" v-for="(vGroup, kGroup) in execByGroup">
        <div class="row text-end">
          <span class="fw-bold text-primary pe-4">{{kGroup}}</span>
        </div>
        <div class="mt-2" v-for="(v, k) in vGroup">
          <span class="fw-bold me-2 f-name">{{ v.dataKey }}</span>
          [<span v-for="(value, index) in Object.values(v.params)" :class="{ 'me-2': index !== v.params.length - 1 }">
        {{ value.name }} <span v-if="index !== v.params.length - 1">,</span>
        </span>]
          <span class="me-2 ms-2">-></span>
          <span class="">{{ v.ret }}</span>
        </div>
      </div>


    </div>

    <div class="functions2">
      <h5 class="text-primary">execute2</h5>
      <div class="mt-2" v-for="(v, k,) in local.info.functions2">
        <span class="fw-bold me-2 f-name">{{ k }}</span>
        [<span v-for="(value, index) in Object.values(v.params)" :class="{ 'me-2': index !== v.params.length - 1 }">
        {{ value.name }} <span v-if="index !== v.params.length - 1">,</span>
        </span>]
        <span class="me-2 ms-2">-></span>
        <span class="">{{ v.ret }}</span>
      </div>
    </div>

    <div class="row">
      <x-collapse k="InfoApi Entity">
        <x-json :obj="local.info"></x-json>
      </x-collapse>
    </div>

  </div>
</template>

<style scoped>
.api-info > * {
  margin-top: 0.5rem;
}

.title-name {
  transform: translateY(4px);
}

.f-name {
  min-width: 8ch;
  display: inline-block;
}

.functions {
  border: 2px solid black;
  padding: 4px;
  background-color: var(--bs-secondary-bg)
}

.functions2 {
  border: 2px solid black;
  padding: 4px;
  background-color: var(--bs-secondary-bg)
}
</style>