<script setup>
/*
  [VARS] - init, imports, template, script, style, name

  Usage:
    const documentation = defineAsyncComponent(() => import("/v3/actions/auth/www/pages/documentation.vue"))
    <documentation/>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, ref, onMounted, onUnmounted, defineAsyncComponent, watch} from 'vue'
import {getLogger} from "Logging";
import {store as storeLocal, api as apiLocal, registry, instanceId} from '../store.mjs'
import Documentation from "/core/pages/Documentation.vue"

// !# C0CKP1T_START imports

// !# C0CKP1T_END imports

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "pages/homepage.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// !# C0CKP1T_START script
const local = reactive({
    id: LOG_HEADER,
    instanceId: instanceId
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
        setTimeout(async () => { await init() }, 1000)
    }
}
onMounted(async () => { init() })
</script>

<template>
<!--  !# C0CKP1T_START template -->
<x-section extra="fs-3" k="Documentation" :visible="true">
    <Documentation :remotePathMapping="`/${storeLocal.islandDir}/docs`"></Documentation>
</x-section>
<!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */

/* !# C0CKP1T_END style */
</style>


