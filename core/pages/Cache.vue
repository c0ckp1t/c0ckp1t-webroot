<script setup>
/*
    page-cache.vue
*/

//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, markRaw, onMounted, computed} from 'vue'
import { store as storeMain, api as apiMain } from 'GlobalStore'
import {getLogger} from "Logging";
import {useRouter} from "vue-router";

const router = useRouter()
const options = apiMain.options()

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'page-cache.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

//________________________________________________________________________________
// STATE
//________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  moduleCache: null,
  vueComponents: [],
  es6Modules: [],
  loading: [],
  routes: [],
});

async function refresh() {
  logger.info(`refresh()`)
  const cache = options.moduleCache

  local.moduleCache = markRaw(options.moduleCache)
  local.sourceCode = markRaw(options.sourceCode)

  local.es6Modules = Object.keys(local.moduleCache)
      .filter(key => {
        const val = local.moduleCache[key]
        return typeof val === 'object' && val !== null && !Reflect.has(val, "__name")
      })
      .map(key => {
        const isPromise = Reflect.has(cache[key], "promise")
        let sourceCode = null
        if (local.sourceCode[key] !== undefined && local.sourceCode[key].hasOwnProperty("code")) {
          sourceCode = local.sourceCode[key]
        }
        return {
          key: key,
          sourceCode: sourceCode,
          isPromise: isPromise,
        }
      }).sort((a, b) => a.key.localeCompare(b.key))

  local.vueComponents = Object.keys(local.moduleCache)
      .filter(key => {
        const val = local.moduleCache[key]
        return typeof val === 'object' && val !== null && Reflect.has(val, "__name")
      })
      .map(key => {
        let sourceCode = null
        if (local.sourceCode[key] !== undefined && local.sourceCode[key].hasOwnProperty("code")) {
          sourceCode = local.sourceCode[key]
        }
        return {
          key: key,
          sourceCode: sourceCode,
          vueName: local.moduleCache[key]['__name'],
        }
      }).sort((a, b) => a.key.localeCompare(b.key))
}

async function loadComponent(key) {
  logger.info(`loadComponent - ${key}`)
}

async function loadRoutes() {
  const routes = apiMain.getRoutes()
  local.routes = JSON.parse(JSON.stringify(routes)).sort((a, b) => a.path.localeCompare(b.path))
}

//________________________________________________________________________________
// INIT
//________________________________________________________________________________
async function init() {
  await refresh()
  await loadRoutes()
}

onMounted(() => {
  init()
})

</script>


<template>
  <x-section :level="2" :visible="true" k="Cache">

    <template v-slot:header>
      <ExecButton icon="fa-rotate-right" :callback="() => init()"></ExecButton>
    </template>

    <x-section :level="4 " :visible="false" k="Routes">
      <template v-slot:header>
        <ExecButton icon="fa-rotate-right" :callback="() => loadRoutes()"></ExecButton>
      </template>

      <x-table-open :exclude="['instances', 'leaveGuards', 'updateGuards', 'enterCallbacks', 'components', 'props', 'aliasOf', 'meta', 'beforeEnter', 'children']" :arr="local.routes" v-slot="slotProps">

        <x-collapse k="Entity">
          <x-json :obj="local.routes[slotProps.v]"></x-json>
        </x-collapse>

      </x-table-open>

    </x-section>

    <x-section :level="4 " k="Vue Components">
      <x-table-open :exclude="['sourceCode']" :arr="local.vueComponents" v-slot="slotProps">
        <ExecButton icon="fa-play"
                  :callback="() => loadComponent(local.vueComponents[slotProps.v].key)">Load Component
        </ExecButton>
        <x-collapse k="Entity">
          <x-json :obj="local.vueComponents[slotProps.v]"></x-json>
        </x-collapse>
      </x-table-open>
    </x-section>

    <x-section :level="4" k="JavaScript or Loading Components">

      <x-table-open :exclude="['sourceCode']" :arr="local.es6Modules" v-slot="slotProps">
        <x-collapse k="Entity">
          <x-json :obj="local.es6Modules[slotProps.v]"></x-json>
        </x-collapse>
      </x-table-open>

    </x-section>



  </x-section>
</template>
