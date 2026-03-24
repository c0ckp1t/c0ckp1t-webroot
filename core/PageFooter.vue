<script setup>
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, ref, onMounted, onUnmounted, watch, computed} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'PageFooter.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// LOCAL
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
})

</script>


<template>
    <footer class="container-fluid p-4 bg-body-tertiary border-top" v-if="storeMain.config?.showFooter ?? true">
      <div class="row mt-4 align-items-center justify-content-center">
        <div class="col-6 d-flex flex-column align-items-center">
          <img src="./img/logo_v1.svg" width="24" height="24" class="d-block mb-3" alt="Product logo" role="img" />
          <small class="d-block mb-3 text-body-secondary">&copy; 2017–2025</small>
          <small class="d-block mb-3 text-body-secondary">Product of <a href="https://sorsha.com">sorsha.com</a></small>
          <small class="d-block mb-3 text-body-secondary">Made in USA</small>
          <img src="./img/Flag_of_the_United_States.svg" width="24" height="24" class="d-block mb-3" alt="Product logo" role="img" />
        </div>
      </div>
    </footer>
</template>

<style>
/* !# C0CKP1T_START style */

/* !# C0CKP1T_END style */
</style>
