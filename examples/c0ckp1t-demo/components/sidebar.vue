<script setup>
/*
  [VARS] - content, import

  Usage:
    const PageSidebar= defineAsyncComponent(() => import("/v3/workflows/wf/www/components/sidebar.vue"))
    <page-sidebar></page-sidebar>
*/

// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, ref, shallowRef, onMounted, onUnmounted, defineAsyncComponent, watch} from 'vue'
import {useRoute} from 'vue-router'
import {getLogger} from "Logging";
import {api as apiLocal, store as storeLocal, routerEndpoint, registry} from '../store.mjs'

const route = useRoute()
const isDocsActive = computed(() => route.path.startsWith(`${routerEndpoint}/docs`))

// !# C0CKP1T_START import

// !# C0CKP1T_END import
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "components/sidebar.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")
</script>

<template>
  <div class="sidebar border border-right col-md-2 col-lg-2 p-0 bg-body-tertiary">
    <section class="top" style="min-height: 5vh;"></section>

    <hr class="my-2">

    <div class=" d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">

      <ul class="nav flex-column mb-auto">
        <RouterLink class="nav-link d-flex align-items-center gap-2" :to="`${routerEndpoint}/homepage`">Homepage</RouterLink>
        <RouterLink class="nav-link d-flex align-items-center gap-2" :class="{ 'router-link-active': isDocsActive }" :to="`${routerEndpoint}/docs`" >Documentation</RouterLink>
      </ul>

      <hr class="my-2"> 

<!--  !# C0CKP1T_START content -->

      <span class="ms-2 text-secondary fw-bold">PAGES</span>
      <ul class="nav flex-column">
      </ul>

<!--  !# C0CKP1T_END content -->

    </div>
  </div>
</template>

<style scoped>
.sidebar {
  min-height: 100vh;
}

.sidebar .nav-link {
  font-size: .875rem;
  font-weight: 500;
}

.sidebar .router-link-active {
  color: var(--bs-primary);
}

.nav-link:hover {
  cursor: pointer;
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
}
</style>


