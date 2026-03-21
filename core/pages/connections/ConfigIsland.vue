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

const connection = computed(() => {
  return registry.value?.connection ?? null
})

const connectText = computed(() => {
  if (connection.value.state.isConnected) {
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


</script>


<template>
  <x-section :level="3" :visible="true" k="Island Connection" v-if="connection">

      <div class="mt-2 mb-2" :class="{ 'is-dirty': connection.state.connectionDirty}">
        <!--      <x-label k="URL">{{ connection.url }}</x-label>-->
        <x-input k="Host" v-model="connection.store.hostname"></x-input>
        <x-input k="Port" type="number" v-model="connection.store.port"></x-input>
        <x-input k="endpoint" v-model="connection.store.endpoint"></x-input>
        <x-input k="username" v-model="connection.store.username"></x-input>
        <x-input :type="local.isPasswordVisible ? 'text' : 'password'" v-model="connection.store.password"
                 k="password"></x-input>

      </div>

      <div class="connection-errors" v-if="connection.state?.errorMessages?.length > 0">
        <div class="fw-bold text-danger">Errors:</div>
        <div v-for="errorMsg in connection.state?.errorMessages">
          {{ errorMsg }}
        </div>
      </div>

      <div class="row mb-4 ">
        <div class="col"></div>
        <div class="col-auto">
          <ExecButton icon="" class="btn btn-primary" :callback="() => registry?.connect()">
            {{ connectText }}
          </ExecButton>
        </div>
        <div class="col-auto" v-if="connection.state?.isConnected">
          <ExecButton icon="" class="btn btn-warning" :callback="() => registry?.disconnect()">
            Disconnect
          </ExecButton>
        </div>
      </div>


      <x-section :level="4" :visible="false" k="Connection Details">
          <x-label k="Connection State:">{{ connection.state?.connStateString }}</x-label>
          <x-label k="Subscription Count:">{{ connection.state?.subscriptionCount }}</x-label>
          <x-label k="Session State:">{{ connection.state?.sessionStateString }}</x-label>
          <x-label k="isConnected:">{{ connection.state?.isConnected }}</x-label>
          <x-label k="isAuthenticated:">{{ connection.state?.isAuthenticated }}</x-label>
          <x-label k="HasErrors:">{{ connection.state?.errorMessages?.length > 0 }}</x-label>

          <x-label k="Retry Enabled:">{{ connection.state?.retryEnable }}</x-label>
          <x-label k="Retries:">{{ connection.state?.retries }}</x-label>
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
