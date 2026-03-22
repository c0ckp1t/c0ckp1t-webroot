<script setup>
/**
 * Main page component. This is the root component for the main dashboard area.
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, ref, onMounted, onUnmounted, watch, computed, onErrorCaptured} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

import {api as apiTheme, store as storeTheme} from "./Theme.mjs"

import PageFallback from "./PageFallback.vue"
import PageFooter from "./PageFooter.vue";
import PageNavigation from "./PageNavigation.vue";

import MainOffCanvas from "./main-offcanvas.vue";
import NotifyToast from "./notify/toast.vue";

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

/**
 * In Bootstrap 5, the best practice for a full-page theme is to apply the data-bs-theme attribute
 *  to the <html> or <body>. This sets it on the <html> tag dynamically.
 */
watch(
    () => storeTheme.theme,
    (newTheme) => {
      document.documentElement.setAttribute('data-bs-theme', newTheme)
    },
    { immediate: true } // Run immediately on load
)

//________________________________________________________________________________
// INIT
//________________________________________________________________________________
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

</script>


<template>
  <div class="page-main">
    <!-- ========== FIXED SIDEBAR ========== -->
    <MainOffCanvas/>
    <!-- ==========  NAVIGATION ========== -->
    <PageNavigation />
    <!-- ==========  MAIN CONTENT ========== -->
    <main class="container-fluid main-content" :style="mainContentStyle">
            <page-fallback v-if="storeMain.componentErrors.length > 0 "></page-fallback>
            <RouterView/>
    </main>
    <NotifyToast/>
    <!-- ==========  FOOTER ========== -->
    <PageFooter />
  </div>
</template>

<style>
/* !# C0CKP1T_START style */
:root {
  --navbar-height: 56px;
}

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
