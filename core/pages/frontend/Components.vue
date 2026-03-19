<script setup>
  /*
    [VARS] - name, init, imports, template, script, style

    Usage:
      const PageXXXX = defineAsyncComponent(() => import("/pages/About.vue"))
      <PageXXXX></PageXXXX>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, ref, markRaw, onMounted, watch, computed, onErrorCaptured} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

// !# C0CKP1T_START imports

// !# C0CKP1T_END
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "frontend/Components.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")


// !# C0CKP1T_START script
const local = reactive({
  id: LOG_HEADER,
})
// !# C0CKP1T_END

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
// !# C0CKP1T_START init

// !# C0CKP1T_END init
}
onMounted(async () => { init() })
</script>

<template>
<!--  !# C0CKP1T_START template -->
  <RouterView />
<!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */

/* !# C0CKP1T_END style */
</style>


