<script setup>
/*
  Used in the sidebar above the registry tree to display information about the connection
 */
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, onMounted, computed, onUnmounted, defineAsyncComponent, watch, onErrorCaptured} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

const props = defineProps({
  id: String
})
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'connection-header.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
})

const registry = storeMain.r[props.id]
</script>


<template>
  <div class="connection-header"   @click="apiMain.routeByEndpoint(`/default/connections/${props.id}`)">

    <div class="card text-center">
      <div class="card-header press p-1" >
        <div class="row">
          <div class="col">
            <div class="instance-id text-primary fw-bold ">{{ registry?.instanceId || 'Invalid Registry'}}</div>
          </div>
          <div class="col">
            <i class="text-success fa-solid fa-globe ms-1"
               :class="{ 'text-success': registry.connection.state.isConnected, 'text-warning': !registry.connection.state.isConnected }"></i>
            <span class="state-text ms-1 fw-bold">{{ registry.connection.state.sessionStateString }}</span>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col">
            <x-label :isCompact="true" k="Username:">{{registry.connection.store.username}}</x-label>
          </div>
          <div class="col">
            <x-label :isCompact="true" k="URL:">{{registry.connection.url}}</x-label>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<style scoped>
.press {
  background-color: #212529;
  color: #b1cfe9;
  cursor: pointer;
  line-height: 1.1rem;
  text-align: center;
}

.press:hover {
  background-color: #000000;
  font-size: 1.1rem;
}
</style>