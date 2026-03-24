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

import {api as apiTheme, store as storeTheme} from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.15/core/Theme.mjs"
import PageFallback from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.15/core/PageFallback.vue"
import MainOffcanvas from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.15/core/main-offcanvas.vue";
import NotifyToast from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.15/core/notify/toast.vue";

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
  toggle: false,
  items: [ ],
  navCloseLogo: storeMain.config?.navCloseLogo ?? "./img/logo_v1.svg",
  navOpenLogo: storeMain.config?.navOpenLogo ?? "./img/logo_v2.svg",
  navHasSearch: storeMain.config?.navHasSearch ?? true,
  navHasThemeSel: storeMain.config?.navHasThemeSel ?? true,
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
onMounted(() => {

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

    <!-- ========== FIXED SIDEBAR ========== -->
    <main-offcanvas/>

    <!-- ==========  NAVIGATION ========== -->
    <nav :class="navbarClass" class="navbar navbar-expand-lg fixed-top">
      <div class="container">

        <a class="navbar-brand">
          <span  @click.prevent="apiMain.selectLogo()" class="nav-select">
            <span  class="me-2 text-warning" v-if="storeMain.showSidebar"><<</span>
            <img :src="local.navCloseLogo" alt="Logo" height="24" class="d-inline-block align-text-top" v-if="!storeMain.showSidebar && local.navCloseLogo">
            <img :src="local.navOpenLogo" alt="Logo" height="24" class="d-inline-block align-text-top" v-if="storeMain.showSidebar && local.navOpenLogo">
          </span>
          <span class="text-warning fw-bold ms-2 brand-text" @click.prevent="apiMain.routeByEndpoint('/')">{{ storeMain.name }}</span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
                aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav flex-grow-1 justify-content-center">
            <li class="nav-item" v-for="item in local.items" :key="item.path">
              <RouterLink :to="item.path" class="nav-link">
                {{ item.name }}
              </RouterLink>
            </li>
          </ul>

          <form class="d-flex">
            <input v-if="local.navHasSearch" class="form-control me-2" type="search" placeholder="Search" v-model="local.searchQuery">
            <button v-if="local.navHasSearch" class="btn btn-outline-secondary" type="submit">
              <i class="fa-solid fa-search"></i>
            </button>
            <button v-if="local.navHasThemeSel" class="btn btn-outline-secondary me-2" type="button" @click="storeTheme.theme = storeTheme.theme === 'dark' ? 'light' : 'dark'" title="Toggle theme">
              <i class="fa-solid" :class="storeTheme.theme === 'dark' ? 'fa-sun' : 'fa-moon'"></i>
            </button>
          </form>
        </div>
      </div>
    </nav>

    <!-- ==========  MAIN CONTENT ========== -->
    <main class="container-fluid main-content" :style="mainContentStyle">
            <page-fallback v-if="storeMain.componentErrors.length > 0 "></page-fallback>
            <RouterView/>
    </main>

    <NotifyToast/>
    <!-- ==========  FOOTER ========== -->

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

.brand-text {
  padding: 3px;
}
.brand-text:hover {
  cursor: pointer;
  background-color: rgba(var(--bs-info-rgb), 0.1);
}

.nav-select {
  display: inline-block;
  padding-left: 8px;
}
.nav-select:hover {
  cursor: pointer;
  background-color: rgba(var(--bs-warning-rgb), 0.1);
  border-radius: 4px;
  transform: scale(1.05);
  transition: background-color 0.2s ease;
}

/* Fixed navbar height compensation */
.navbar.fixed-top {
  z-index: 1030;
}

/* Main content area */
.main-content {
  min-height: 100vh;
  padding-top: var(--navbar-height); /* Space for the fixed navbar */
}

/* !# C0CKP1T_END style */
</style>
