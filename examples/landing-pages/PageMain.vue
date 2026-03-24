<script setup>
/**
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, ref, onMounted, onUnmounted, watch, computed, onErrorCaptured} from 'vue'
import {getLogger} from "Logging";

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

  selectedItem: null,
  items: [
    {k: "landing-page-00.html", v: "landing-page-00.html"},
    {k: "landing-page-01.html", v: "landing-page-01.html"},
    {k: "landing-page-02.html", v: "landing-page-02.html"},
    {k: "landing-page-03.html", v: "landing-page-03.html"},
    {k: "landing-page-04.html", v: "landing-page-04.html"}
  ],
})

//________________________________________________________________________________
// INIT
//________________________________________________________________________________
onMounted(() => {
  if (local.items.length > 0) {
    local.selectedItem = local.items[0].v
  }
})
</script>

<template>
  <div class="page-main">

    <!-- Fixed top navbar -->
    <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">

      <div class="container-fluid">
        <span class="navbar-brand fw-bold text-warning">{{ local.selectedItem }}</span>
        <x-dropdown2 k="Landing Page: " :items="local.items" v-model="local.selectedItem"></x-dropdown2>
      </div>
    </nav>

    <!-- Iframe to display selected landing page -->
    <div class="iframe-container">
      <iframe v-if="local.selectedItem"
              :src="local.selectedItem"
              class="landing-iframe"
              allowfullscreen>
      </iframe>
      <div v-else class="d-flex justify-content-center align-items-center h-100 text-muted">
        <p class="fw-bold">Select a landing page from the dropdown above.</p>
      </div>
    </div>

  </div>
</template>

<style>
/* !# C0CKP1T_START style */

.page-main {
  padding-top: 56px; /* offset for fixed navbar */
}

.iframe-container {
  width: 100%;
  height: calc(100vh - 56px);
}

.landing-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* !# C0CKP1T_END style */
</style>
