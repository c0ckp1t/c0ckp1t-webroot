<script setup>
/**
 * Displays and manages the connections to server instances.
 *  TODO: Uses conditional statements but in future
 *   can be refactored to use dynamic component loading based on registry type
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {ref, markRaw, reactive, watch, onMounted, computed, defineAsyncComponent} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";
import {useRouter} from "vue-router";
import {api as notifyApi} from 'NotifyUtils'

const ConfigDefaultIsland = defineAsyncComponent(() => import("./connections/ConfigDefaultIsland.vue"))
const ConfigIsland = defineAsyncComponent(() => import("./connections/ConfigIsland.vue"))

const router = useRouter()

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'pages/Connection.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

//________________________________________________________________________________
// STATE
//________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  showStoreObject: false,
  showStateObject: false,
  showConnectionObject: false,
  showConnectionDetails: false,
  isPasswordVisible: false
});

// The id of the connection we want to display
const instanceId = computed(() => {
  return router.currentRoute.value.params?.id ?? null
})

const registry = computed(() => {
  return storeMain.r[instanceId.value] ?? null
})

const connection = computed(() => {
  return registry.value?.connection ?? null
})

//________________________________________________________________________________
// PRIVATE METHODS
//________________________________________________________________________________
async function saveConnection() {
  const res = await apiMain.saveIslandConfig(instanceId)
  if(!res.isOk) {
    await notifyApi.badDetails(`saveIslandConfig`, res.result)
  } else {
    await notifyApi.goodDetails(`saveIslandConfig`, res.result)
  }
}

async function deleteConnection() {
  const res = await apiMain.deleteIslandConfig(instanceId)
  if(!res.isOk) {
    await notifyApi.badDetails(`deleteConnection`, res.result)
  } else {
    await notifyApi.goodDetails(`deleteConnection`, res.result)
  }
}

</script>


<template>
  <div class="connection mt-2 mb-2">
    <div class="row mt-2 mb-2 align-items-center">
      <div class="col">
        <ExecButton icon="fa-arrow-left me-1"
                    :callback="() => apiMain.routeByEndpoint(`/${storeMain.defaultInstanceId}/connections`)">
          Connections
        </ExecButton>
      </div>
      <div class="col-auto">
        <x-label :isCompact="true" k="Instance ID">{{ instanceId }}</x-label>
      </div>
      <div class="col-auto">
        <ExecButton icon="fa-floppy-disk me-1" :callback="() => saveConnection()"
                    :disabled="connection && !connection?.state?.connectionDirty">Save
        </ExecButton>
      </div>
      <div class="col-auto">
        <ExecButton icon="fa-trash me-1" :callback="() => deleteConnection()">Delete</ExecButton>
      </div>
    </div>

    <div v-if="registry?.type === 'IslandDefault'">
      <ConfigDefaultIsland :instanceId="instanceId"/>
    </div>
    <div v-else-if="registry?.type === 'Island'">
      <ConfigIsland :instanceId="instanceId"/>
    </div>
    <div v-else>
      <h3>Island Not Found (instanceId="{{ instanceId }}")</h3>
      <p>The island you are trying to access does not exist.</p>
    </div>


  </div>
</template>


<style scoped>
.connection {
  padding: 1rem;
  border: 2px solid black;
}
</style>
