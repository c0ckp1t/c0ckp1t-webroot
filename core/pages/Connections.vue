<script setup>
/*
  connection-header-details.vue
*/

//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, onMounted, defineAsyncComponent, computed} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";
import {useRoute} from "vue-router";
import {api as notify} from "NotifyUtils"
import ExecButton from "../../components/ExecButton.vue";
const ConnectionHeaderDetails = defineAsyncComponent(() => import("./connections/connection-header-details.vue"))

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'page-connections.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

//________________________________________________________________________________
// STATE
//________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  moduleCache: null,
  connectionName: "root"
});

function createConnection() {
  // TODO: create correct config
  const config  = {}
  config.instanceId = local.connectionName
  try {
    apiMain.createRegistry(config)
  } catch(e) {
    notify.badDetails(`[${local.id}]`, e)
  }
}

function deleteConnection() {

}

const route = useRoute()

const showConnections = computed(() => {
  if (route.fullPath.endsWith('default/connections')) {
    return true
  }
  return false
})

async function loadDemo() {
  const { config } = await import("/app-demo/IslandDefaultConfig.mjs")
  await apiMain.registerStaticIsland(config)
}

//________________________________________________________________________________
// INIT
//________________________________________________________________________________
async function init() {

}

onMounted(() => {
  init()
})

</script>


<template>
  <div class="page-connections">
    <x-section extra="fs-4" k="Connections" >
      <div v-for="(v, k) in storeMain.r" class="row m-2">
        <ConnectionHeaderDetails :id="k"></ConnectionHeaderDetails>
      </div>

      <x-section extra="fs-5" :visible="true" k="Create New Connection">
        <div class="row mb-2">
          <div class="col">
            <x-input k="Name" v-model="local.connectionName"></x-input>
          </div>
          <div class="col-auto">
            <ExecButton icon="fa-floppy-disk me-1 " :callback="() => createConnection()">Create Connection </ExecButton>
          </div>
        </div>
      </x-section>


      <ExecButton :callback="() => loadDemo()">Load Demo</ExecButton>


    </x-section>

  </div>
</template>
