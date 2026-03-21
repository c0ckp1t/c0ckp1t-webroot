<script setup>
/**
 * Used in the sidebar above the registry tree to display
 *  information about the connection
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
const LOG_HEADER = 'connections/connection-header.vue'
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
  <div class="connection-header">
    <div class="press " @click="apiMain.routeByEndpoint(`/${storeMain.defaultInstanceId}/connections/${props.id}`)">
      <i class="text-success fa-solid fa-globe me-1"
         :class="{ 'text-success': registry.state.isReady, 'text-warning': !registry.state.isReady}">
      </i>
      <span class="instance-id text-primary fw-bold ">{{ registry?.instanceId ?? 'Invalid Registry'}}</span>
    </div>
  </div>
</template>

<style scoped>
.connection-header {

}

.press {
  padding: 3px;
  background-color: var(--bs-secondary-bg);
  cursor: pointer;
  line-height: 1.1rem;
  text-align: center;
}

.press:hover {
  background-color: var(--bs-secondary-bg-subtle);
  font-size: 1.1rem;
}
</style>