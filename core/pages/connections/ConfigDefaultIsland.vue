<script setup>
/**
 * Config Display for Default Island Connection
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {ref, markRaw, reactive, watch, onMounted, computed} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {api as notifyApi} from 'NotifyUtils'
import {getLogger} from "Logging";

const props = defineProps({
  instanceId: String
})

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'connections/ConfigDefaultIsland.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

//________________________________________________________________________________
// STATE
//________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
});

const registry = computed(() => {
  return storeMain.r[props.instanceId] ?? null
})

</script>

<template>
  <x-section :level="3" :visible="true" k="Default Connection">

    <x-label k="Instance Id">{{registry?.instanceId}}</x-label>
    <x-label k="Type">{{registry?.type}}</x-label>
    <x-label k="appName">{{registry?.config?.appName}}</x-label>
    <x-label k="appEndpoint">{{registry?.config?.appEndpoint}}</x-label>

    <p class="mt-2 fw-bold">
      This connection is always valid because it loaded through HTTP or HTTPS as static content.
    </p>

    <x-section :level="4" :visible="false" k="Registry">
      <x-json :obj="registry"></x-json>
    </x-section>

  </x-section>
</template>


<style scoped>
</style>
