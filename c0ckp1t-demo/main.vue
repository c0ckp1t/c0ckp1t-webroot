<script setup>
/*
  Usage:
    const PageMain = defineAsyncComponent(() => import("/v3/workflows/wf/www/main.vue"))
    <page-main></page-main>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import { reactive, computed, ref, onMounted, onUnmounted, defineAsyncComponent, onErrorCaptured } from 'vue'
import { store as storeMain} from 'GlobalStore'
import {getLogger} from "Logging";

import {api as apiLocal, store as storeLocal} from './store.mjs'
import PageSidebar from "./components/sidebar.vue"

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "main.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

</script>

<template>
  <div class="row">
    <page-sidebar></page-sidebar>
    <main class="col-md-10 ms-sm-auto col-lg-10 px-md-4 mt-2">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style >
/* !# C0CKP1T_START style */

/* !# C0CKP1T_END */
</style>
