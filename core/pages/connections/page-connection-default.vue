<script setup>
/**
 * Manages the default connection
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {ref, markRaw, reactive, watch, onMounted, computed} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";
import ClientStorage2 from  "core/ClientStorage2.mjs"
const storage = new ClientStorage2("auth", "default")

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'admin/page-connection.vue'
const logger = getLogger(LOG_HEADER)

//________________________________________________________________________________
// STATE
//________________________________________________________________________________
const local = reactive({
  isLoading: false,
});


const registry = storeMain.r['default']


// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  const resGet = await storage.storageGet("authEntity")
  if(resGet !== null) {
    logger.info(`[AuthEntity] - read`)
    console.log(resGet)
    return
  }
  const authEntity = await storage.build("authEntity", {
    hostname: storeMain.config.HOSTNAME,
    port: parseInt(storeMain.config.PORT) + 1,
    protocol: storeMain.config.PROTOCOL,
    endpoint: "socket",
    username: storeMain.config.defaultUsername,
    password: storeMain.config.defaultPassword,
    isSecure: storeMain.config.IS_SECURE,
  }, "OBJECT")
  storage.storageCreate(authEntity)

  logger.info("[AuthEntity] - created")
  console.log(authEntity)
}

onMounted(() => {
  init()
})

</script>


<template>
  <x-section extra="fs-4" :visible="true" :k="`Default Connection`">

    <div class="row">
      <x-collapse k="Registry" >
        <x-json :obj="registry"></x-json>
      </x-collapse>
    </div>

    <x-label k="Instance Id: ">{{registry?.instanceId}}</x-label>

    <p class="mt-2 fw-bold">
      This connection is always valid because it loaded through HTTP or HTTPS as static content.
    </p>

    <p  class="fw-bold">
    If this connection was not valid you wouldn't be seeing this or any page.
    </p>

    <x-collapse k="View Raw Entity" class="row mt-2 mb-2">
      <x-json :obj="registry"></x-json>
    </x-collapse>

  </x-section>
</template>


<style scoped>
</style>
