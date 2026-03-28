<script setup>
/**
 *
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {ref, markRaw, reactive, watch, onMounted, computed, defineAsyncComponent} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {api as notifyApi} from 'NotifyUtils'
import {getLogger} from "Logging";

const props = defineProps({
  instanceId: String
})
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'connections/ConfigIsland.vue'
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


const registry = computed(() => {
  return storeMain.r[props.instanceId] ?? null
})

watch(registry, (val) => {
  console.log('registry value:', val)
  console.log('registry type:', typeof val)
  console.log('registry keys:', val ? Object.keys(val) : 'null')
}, { immediate: true })



const connectText = computed(() => {
  if (registry.value?.connection?.state.isConnected) {
    return "Authenticate"
  } else {
    return "Connect"
  }
})
//________________________________________________________________________________
// PRIVATE METHODS
//________________________________________________________________________________
async function refreshRootNode() {
  await storeMain.r[props.instanceId].rootNode()
  notifyApi.goodDetails("Root Node Refreshed", `The root node for instance "${props.instanceId}" has been refreshed.`)
}

async function connect() {
  try {
    await registry.value?.connect()
  } catch(e) {
    console.log(e)
  }
}

async function disconnect() {
  try {
    await registry.value?.disconnect()
  } catch(e) {
    console.log(e)
  }
}

</script>


<template>
  <x-section :level="3" :visible="true" k="Island Connection" v-if="registry.connection">

      <div class="mt-2 mb-2" :class="{ 'is-dirty': registry.connection?.state.connectionDirty}">
        <!--      <x-label k="URL">{{ connection.url }}</x-label>-->
        <x-input k="Host" v-model="registry.connection.store.hostname"></x-input>
        <x-input k="Port" type="number" v-model="registry.connection.store.port"></x-input>
        <x-input k="Endpoint" v-model="registry.connection.store.endpoint"></x-input>
        <x-input k="Username" v-model="registry.connection.store.username"></x-input>
        <x-input :type="local.isPasswordVisible ? 'text' : 'password'" v-model="registry.connection.store.password"
                 k="Password"></x-input>

      </div>

      <div class="connection-errors" v-if="registry.connection.state?.errorMessages?.length > 0">
        <div class="fw-bold text-danger">Errors:</div>
        <div v-for="errorMsg in registry.connection.state?.errorMessages">
          {{ errorMsg }}
        </div>
      </div>

      <x-label k="URL">{{registry?.connection?.url}}</x-label>

      <div class="row mb-4 ">
        <div class="col"></div>
        <div class="col-auto">
          <ExecButton icon="" class="btn btn-primary" :callback="() => connect()">
            {{ connectText }}
          </ExecButton>
        </div>
        <div class="col-auto" v-if="registry.connection.state?.isConnected">
          <ExecButton icon="" class="btn btn-warning" :callback="() => disconnect()">
            Disconnect
          </ExecButton>
        </div>
      </div>


      <x-section :level="4" :visible="false" k="Connection Details">
          <x-label k="Connection State:">{{ registry.connection.state?.connStateString }}</x-label>
          <x-label k="Subscription Count:">{{ registry.connection.state?.subscriptionCount }}</x-label>
          <x-label k="Session State:">{{ registry.connection.state?.sessionStateString }}</x-label>
          <x-label k="isConnected:">{{ registry.connection.state?.isConnected }}</x-label>
          <x-label k="isAuthenticated:">{{ registry.connection.state?.isAuthenticated }}</x-label>
          <x-label k="HasErrors:">{{ registry.connection.state?.errorMessages?.length > 0 }}</x-label>

          <x-label k="Retry Enabled:">{{ registry.connection.state?.retryEnable }}</x-label>
          <x-label k="Retries:">{{ registry.connection.state?.retries }}</x-label>
      </x-section>

      <x-section :level="4" :visible="false" k="Registry" v-if="registry">
        <template v-slot:header>
          <ExecButton icon="fa-rotate-right me-1" class="btn btn-sm btn-primary" :callback="() => refreshRootNode()">
            Refresh Root Node
          </ExecButton>
        </template>

        <x-json :obj="registry"></x-json>
      </x-section>

  </x-section>
</template>


<style scoped>


</style>
