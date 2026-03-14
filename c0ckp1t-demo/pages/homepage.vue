<script setup>
/*
  [VARS] - name, init, imports, template, script, style

  Usage:
    const PageXXXX = defineAsyncComponent(() => import("/v3/workflows/wf/www/pages/homepage.vue"))
    <page-xxxx></page-xxxx>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, ref, onMounted, onUnmounted, defineAsyncComponent, watch} from 'vue'
import {getLogger} from "Logging";
import {api as notify} from "NotifyUtils"
import {store as storeLocal, api as apiLocal, registry} from '../store.mjs'
import {store as storeMain, api as apiMain} from 'GlobalStore'

// !# C0CKP1T_START imports

// !# C0CKP1T_END imports

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "pages/homepage.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// !# C0CKP1T_START script
// ________________________________________________________________________________
// LOCAL
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
})

// !# C0CKP1T_END script

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (registry.state.isReady) {
// !# C0CKP1T_START init

// !# C0CKP1T_END init
  } else {
    setTimeout(async () => {
      await init()
    }, 1000)
  }
}

onMounted(async () => {
  init()
})
</script>

<template>
<!--  !# C0CKP1T_START template -->
<x-section :level="3" k="Homepage" :visible="true">

</x-section>
<!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */

/* !# C0CKP1T_END style */
</style>


