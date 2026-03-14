<script setup>
/* Note this doesn't load because you need VueRouter
  <RouterView ></RouterView> in parent component that is api place holder node

  Sued where?
 */
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, onMounted, onUnmounted, defineAsyncComponent, watch, onErrorCaptured, computed} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {api as notify} from "NotifyUtils"
import {getLogger} from "Logging"
import {substrAfterFirstSlash} from "JsUtils"
import {useRouter} from "vue-router";

const router = useRouter()

const InfoApi = defineAsyncComponent(() => import("/core/sfc/info-api.vue"))

const instanceId = computed(() => {
  return substrAfterFirstSlash(router.currentRoute.value.fullPath)
})

const selectedNode = computed(() => {
  return storeMain.r[instanceId.value].store.selectedNode
})

const adminEndpoint = computed(() => {
  return selectedNode.value.endpoint.replace("/_admin", "")
})

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'node/_api.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// lcoal store
// ________________________________________________________________________________
const local = reactive({
  isLoading: false,
  id: LOG_HEADER,
})

</script>


<template>

  <div class="_api" >
    <x-section :level="4" :visible="true" :k="`API Node for endpoint=${adminEndpoint}`" v-if="selectedNode">

      <template v-slot:header>
        <ExecButton icon="fa-info" @callback="apiMain.selectDocumentation(storeMain.documentation)"></ExecButton>
      </template>

      <x-collapse k="CurrentRoute ">
        <x-json :obj="JSON.parse(JSON.stringify(router.currentRoute._rawValue))"></x-json>
      </x-collapse>

      <x-section extra="fs-4" :visible="false" :k="`API (${adminEndpoint})`">
        <info-api :endpoint="adminEndpoint" :instanceId="storeMain.selectedInstId"></info-api>
      </x-section>

      <x-section extra="fs-4" :visible="true" :k="`Node`">
        <div class="row mt-4 mb-4">
          <x-collapse k="Node Entity">
            <x-json :obj="selectedNode"></x-json>
          </x-collapse>
        </div>
      </x-section>

    </x-section>
  </div>
</template>

<style scoped>

</style>