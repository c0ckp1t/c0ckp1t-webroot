<script setup>
/*
    offcanvas.vue
    https://getbootstrap.com/docs/5.0/components/offcanvas/

*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, markRaw, onMounted, ref, defineAsyncComponent, watch} from 'vue'
import {store as storeMain, api as apiMain } from 'GlobalStore'
import {getLogger} from "Logging";
import node from "./nodes/node.vue"
import ConnectionHeader from "./sfc/connection-header.vue"
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'main-offcanvas.vue'
const logger = getLogger(LOG_HEADER)

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  isLoading: false,
})

const itemRef = ref(null)

// ________________________________________________________________________________
// API
// ________________________________________________________________________________
function close() {
  storeMain.mainOffCanvas.hide()
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  storeMain.mainOffCanvas = markRaw(new bootstrap.Offcanvas(itemRef.value))
  // storeMain.mainOffCanvas.show()
}

onMounted(async () => {
  // Add event listeners FIRST (before init() calls show())
  itemRef.value.addEventListener('show.bs.offcanvas', () => {
    storeMain.mainOffCanvasOpen = true
  })
  
  itemRef.value.addEventListener('shown.bs.offcanvas', () => {
    // Measure actual width after fully shown
    storeMain.mainOffCanvasWidth = itemRef.value.offsetWidth
  })
  
  itemRef.value.addEventListener('hide.bs.offcanvas', () => {
    storeMain.mainOffCanvasOpen = false
  })
  
  itemRef.value.addEventListener('hidden.bs.offcanvas', () => {
    storeMain.mainOffCanvasWidth = 0
  })
  
  // THEN initialize and show
  await init()
})

</script>


<template>
  <div ref="itemRef" class="offcanvas offcanvas-start" tabindex="-1"  data-bs-scroll="true"
       data-bs-backdrop="false" aria-labelledby="offcanvasRightLabel">

    <div class="offcanvas-body">
      <div v-for="(v, k) in storeMain.r" :class="{'registry-active': k === storeMain.selectedInstId}" class="mt-2 mb-2">
        <connection-header :id="k"></connection-header>
        <ul v-if="storeMain.r[k].store.root" class="nav nav-pills flex-column"
            v-show="storeMain.r[k].store.showRegistry">
          <node :v="storeMain.r[k].store.root" :id="k"></node>
        </ul>
      </div>

    </div>
  </div>
</template>


<style scoped>
.offcanvas {
  width: fit-content;                   /* Shrink to content */
  max-width: 500px;                     /* Your chosen max-width */
  top: var(--navbar-height);            /* Start below navbar */
  height: calc(100vh - var(--navbar-height)); /* Fill remaining viewport */
  z-index: 1020;                        /* Below navbar (1030) */
}

</style>

