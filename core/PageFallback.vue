<script setup>
/*
    page-fallback.vue
*/

//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, onMounted, defineAsyncComponent, watch, computed} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

const NodeDefault = defineAsyncComponent(() => import("../nodes/_admin.vue"))

//________________________________________________________________________________
// STATE
//________________________________________________________________________________
const local = reactive({
  isLoading: false,
  vueComponents: [],
  lastKnownEndpoint: "/unknown"
})

// const selectedNode = computed(() => {
//   return storeMain.r[storeMain.selectedInstId].store.selectedNode
// })

watch(
    // Array of watch sources
    [
      () => storeMain.selectedInstId,
      () => storeMain.r[storeMain.selectedInstId]?.store?.selectedNode?.endpoint,
    ],
    // Callback receives new values in an array
    ([newInstId, newNodeEndpoint]) => {
      if (newInstId === null) {
        local.lastKnownEndpoint = '/unknown'
      } else {
        local.lastKnownEndpoint = newNodeEndpoint ?? '/unknown'
      }
    },
    {
      immediate: true, // Fire right away on component mount
    }
)

async function refresh() {
  const localModuleCache = apiMain.options().moduleCache
  const localSourceCode = apiMain.options().sourceCode
  local.vueComponents = Object.keys(localModuleCache)
      .filter(key => !Reflect.has(localModuleCache[key], "__name"))
      .map(key => {
        const isPromise = Reflect.has(localModuleCache[key], "promise")
        let sourceCode = null
        if (localSourceCode[key] !== undefined && localSourceCode[key].hasOwnProperty("code")) {
          sourceCode = localSourceCode[key]
        }
        return {
          key: key,
          sourceCode: sourceCode,
          isPromise: isPromise,
        }
      })
      .filter( item => item.isPromise)
      .sort((a, b) => a.key.localeCompare(b.key))
}

function clearAndReloadByKey(key) {
  console.log(`clearAndReloadByKey - ${key}`)
}

function clearAndReloadEntireEndpoint() {
  console.log(`clearAndReloadEntireEndpoint - lastKnownEndpoint=${local.lastKnownEndpoint}`)
}

async function loadComponent(key) {
  console.log(`loadComponent - ${key}`)
}

//________________________________________________________________________________
// INIT
//________________________________________________________________________________
function init() {
  refresh()
}

onMounted(() => {
  init()
})

</script>


<template>
  <div class="page-fallback">

    <x-section extra="fs-3 " k="Vue Components">
      <x-table-open :exclude="['sourceCode']" :arr="local.vueComponents" v-slot="slotProps">
        <ExecButton icon="fa-play me-1"
                  :callback="() => clearAndReloadByKey(local.vueComponents[slotProps.v].key)">Clear and Reload
        </ExecButton>
        <x-collapse k="Entity">
          <x-json :obj="local.vueComponents[slotProps.v]"></x-json>
        </x-collapse>
      </x-table-open>
    </x-section>

    <x-section extra="fs-3 " k="Default Node" :visible="false">
      <NodeDefault></NodeDefault>
    </x-section>

    <x-section extra="fs-3 text-danger" k="Error In Component!">

      <div v-for="e in storeMain.componentErrors" class="error-section mt-3">
          <x-label k="dashboardName">{{e.dashboardName}}</x-label>
          <x-label k="info">{{e.info}}</x-label>
          <div class="error-message mt-2">{{e.errorMessage}}</div>
      </div>

      <div class="row mt-4 mb-4">
        <x-collapse k="componentErrors Entity">
          <x-json :obj="storeMain.componentErrors"></x-json>
        </x-collapse>
      </div>

      <div class="row mb-2">
        <div class="col-auto">
          <x-input k="Endpoint Substring:" v-model="local.lastKnownEndpoint"></x-input>
         </div>
        <div class="col-auto">
          <ExecButton icon="fa-rotate-right me-1"  :callback=" () =>clearAndReloadEntireEndpoint()">
            Clear & Reload </ExecButton>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-auto">
          <x-label k="Selected Instance Id:">{{storeMain.selectedInstId}}</x-label>
        </div>
        <div class="col-auto" v-if="storeMain.selectedInstId">
          <ExecButton icon="fa-rotate-right me-1"  :callback="() => storeMain.r[storeMain.selectedInstId].selectDefaultDashboard()">
            Default Component </ExecButton>
        </div>
      </div>

    </x-section>

    <div class="row render-message">
      <h3 class="text-center">Trying to render component with errors</h3>
      <h6 class="text-center">If blank then probably not possible</h6>
      <i class="fa-solid fa-chevron-down text-center"></i>
    </div>

  </div>
</template>

<style scoped>

.error-section {
  border: 2px solid red;
  padding: 5px;
}

.render-message {
  border: 2px solid;
  background-color: #9ecb9c;
}
</style>