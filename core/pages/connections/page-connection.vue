<script setup>
/**
 * Displays and manages the connections to server instances
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {ref, markRaw, reactive, watch, onMounted, computed} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";
import {useRouter} from "vueRouter";
import {leafPath} from "JsUtils"

import ClientStorage2 from "core/ClientStorage2.mjs"

const storage = new ClientStorage2("auth", "default")
import ConnectionHeaderDetails from "core/components/connection-header-details.vue"

const router = useRouter()

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'admin/page-connection.vue'
const logger = getLogger(LOG_HEADER)

//________________________________________________________________________________
// STATE
//________________________________________________________________________________
const local = reactive({
  isLoading: false,
  showRegistryObject: false,
  showConnectionObject: false,
  showConnectionDetails: false,
  isPasswordVisible: false
});

// TODO: how to get this ? Probably from URL? or as a prop
const instanceId = computed(() => leafPath(router.currentRoute.value.fullPath))
const connection = computed(() => {
  const instance = storeMain.r[instanceId.value];
  return instance && instance.connection ? instance.connection : null;
})

function refreshRegistry() {
  storeMain.r[instanceId.value].rootNode()
}

const connectText = computed(() => {
  if (connection.value.state.isConnected) {
    return "Authenticate"
  } else {
    return "Connect"
  }
})

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function saveConnection() {
  await apiMain.saveConnection(instanceId.value, connection.value.store)
}
async function deleteConnection() {
  await apiMain.deleteConnection(instanceId.value)
}


onMounted(() => {
})

</script>


<template>
  <div class="mt-2 mb-2 connection" v-if="connection">

    <div class="row mt-2 mb-2">
      <div class="col"></div>
      <div class="col-auto">
        <ExecButton icon="fa-floppy-disk me-1"  :callback="() => saveConnection()" :disabled="!connection.state.connectionDirty">Save</ExecButton>
      </div>
      <div class="col-auto">
        <ExecButton icon="fa-trash me-1"  :callback="() => deleteConnection()">Delete</ExecButton>
      </div>
    </div>

    <connection-header-details :id="instanceId" :key="instanceId"></connection-header-details>

    <div class="row mt-2 mb-1 justify-content-center">
      <div class="col-auto">
        <x-button icon="fa-rotate-right me-1" :isLoading="local.isLoading" @callback="refreshRegistry">
          Refresh Registry
        </x-button>
      </div>
      <div class="col-auto">
        <x-toggle k="Connection Details" v-model="local.showConnectionDetails"></x-toggle>
      </div>
      <div class="col-auto">
        <x-toggle k="Connection Entity" v-model="local.showConnectionObject"></x-toggle>
      </div>
      <div class="col-auto">
        <x-toggle k="Registry Entity" v-model="local.showRegistryObject"></x-toggle>
      </div>
    </div>

    <div class="row mt-2 mb-2" v-if="local.showRegistryObject">
      <x-json :obj="storeMain.r[instanceId]"></x-json>
    </div>

    <div class="row mt-2 mb-2" v-if="local.showConnectionObject">
      <x-json :obj="connection"></x-json>
    </div>


    <div class="row mt-2 mb-2" v-if="local.showConnectionDetails">
      <x-label k="Connection State:">{{ connection.state.connStateString }}</x-label>
      <x-label k="Subscription Count:">{{ connection.state.subscriptionCount }}</x-label>
      <x-label k="Session State:">{{ connection.state.sessionStateString }}</x-label>
      <x-label k="isConnected:">{{ connection.state.isConnected }}</x-label>
      <x-label k="isAuthenticated:">{{ connection.state.isAuthenticated }}</x-label>
      <x-label k="HasErrors:">{{ connection.state.errorMessages.length > 0 }}</x-label>

      <x-label k="Retry Enabled:">{{ connection.state.retryEnable }}</x-label>
      <x-label k="Retries:">{{ connection.state.retries }}</x-label>
    </div>

    <div class="mt-2 mb-2" :class="{ 'is-dirty': connection.state.connectionDirty}">
      <!--      <x-label k="URL">{{ connection.url }}</x-label>-->
      <x-input k="Host" v-model="connection.store.hostname"></x-input>
      <x-input k="Port" type="number" v-model="connection.store.port"></x-input>
      <x-input k="endpoint" v-model="connection.store.endpoint"></x-input>
      <x-input k="username" v-model="connection.store.username"></x-input>
      <div class="row">
        <div class="col">
          <x-input :type="local.isPasswordVisible ? 'text' : 'password'" v-model="connection.store.password" k="password"></x-input>
        </div>
        <div class="col-auto">
          <x-toggle k="" v-model="local.isPasswordVisible"></x-toggle>
        </div>

      </div>
    </div>

    <div class="fw-bold">Errors:</div>
    <div v-for="errorMsg in connection.state.errorMessages">
      {{ errorMsg }}
    </div>

    <div class="row ">
      <div class="col"></div>
      <div class="col-auto">
        <ExecButton icon="" class="btn btn-primary" :callback="() => storeMain.r[instanceId].connect()">{{ connectText }}</ExecButton>
      </div>
      <div class="col-auto" v-if="connection.state.isConnected">
        <ExecButton icon="" class="btn btn-warning" :callback="() => storeMain.r[instanceId].disconnect()">Disconnect</ExecButton>
      </div>
    </div>




  </div>
</template>


<style scoped>
.is-dirty {
  border-left: 2px solid red;
}

.connection {
  background-color: #f3eedc;
  padding: 1rem;
  border: 2px solid black;
}

</style>
