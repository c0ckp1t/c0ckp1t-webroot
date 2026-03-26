<script setup>
/**
 * Root page for default registry
 *  should be for all registries?
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, ref, onMounted, onUnmounted, watch, computed, onErrorCaptured} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";
import PageFallback from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.19/core/PageFallback.vue"
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'PageMain.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// LOCAL
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
})

//________________________________________________________________________________
// INIT
//________________________________________________________________________________
onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', 'dark')
})
onUnmounted(() => {
})


onErrorCaptured((error, instance, info) => {
  logger.info(`[ERROR]`)
  console.log(instance)
  console.log(error)
  storeMain.componentErrors.push({
    errorStack: error.stack,
    errorMessage: error.message,
    info: info,
    dashboardName: storeMain.dashboardName,
    dashboard: storeMain.dashboard,
  })
  // Return false to prevent the error from propagating further
  return false;
})

// ________________________________________________________________________________
// COMPUTED
// ________________________________________________________________________________
const mainContentStyle = computed(() => ({
  marginLeft: storeMain.mainOffCanvasOpen ? `${storeMain.mainOffCanvasWidth}px` : '0',
  width: storeMain.mainOffCanvasOpen ? `calc(100% - ${storeMain.mainOffCanvasWidth}px)` : '100%',
}))

const navbarClass = computed(() => ({
  'bg-body-tertiary': storeMain.showTopNavBar,
  'border-bottom': storeMain.showTopNavBar,
}))

</script>


<template>
  <div class="page-main">
    <!-- ==========  MAIN CONTENT ========== -->
    <main class="container-fluid main-content" :style="mainContentStyle">
            <page-fallback v-if="storeMain.componentErrors.length > 0 "></page-fallback>
            <RouterView remotePathMapping="/examples/blog/docs" />
    </main>
  </div>
</template>

<style>
/* !# C0CKP1T_START style */
.page-main{
  /* Ensure text color inherits the bootstrap variable */
  color: var(--bs-body-color);
  background-color: var(--bs-body-bg); /* Explicitly set background to match body */
  min-height: 100vh;
}

/* Main content area */
.main-content {
  min-height: 100vh;
  padding-top: var(--navbar-height); /* Space for the fixed navbar */
}

/* !# C0CKP1T_END style */
</style>
