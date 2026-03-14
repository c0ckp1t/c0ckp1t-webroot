<script setup>
/*
  Used in the sidebar above the registry tree to display information about the connection
 */
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, onMounted, computed, onUnmounted, defineAsyncComponent, watch, onErrorCaptured} from 'vue'
import {store as storeMain, api as apiMain } from 'GlobalStore'
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
  <div class="connection-header w-100">
    <div class="press " @click="apiMain.routeByEndpoint(`/default/connections/${props.id}`)">
      <i class="text-success fa-solid fa-globe ms-1"
         :class="{ 'text-success': registry.connection.state.isConnected, 'text-warning': !registry.connection.state.isConnected }"></i>
      <span class="state-text ms-1 fw-bold">{{ registry.connection.state.sessionStateString }}</span>
      <div class="instance-id text-primary fw-bold ">{{ registry?.instanceId ?? 'Invalid Registry'}}</div>
    </div>
  </div>
</template>

<style scoped>
.connection-header {
  width: 100%;
}

.press {
  background-color: var(--bs-secondary-bg);
  color: #b1cfe9;
  cursor: pointer;
  line-height: 1.1rem;
  text-align: center;
}

.press:hover {
  background-color: var(--bs-secondary-bg-subtle);
  font-size: 1.1rem;
}
</style>