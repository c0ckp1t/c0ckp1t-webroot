
# Creating - Single File Components (SFCs)

When creating websites with **C0ckp1t** you generally create Vue Single File Components (SFCs). These are `.vue` files that contain the template, script, and style for a component. 

## A Standard SFC

```js
<script setup>
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, ref, onMounted, watch} from 'vue'
import {getLogger} from "Logging";

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "pages/mypage.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
onMounted(async () => {  })
</script>

<template>
    <x-section :level="2" k="My Page" :visible="true">
         <p>This is my page</p>
    </x-section>
</template>

<style scoped>
    
</style>
```


## More Complex SFCs

For more complex applications it is recommended create a `store.mjs` module and import it in the SFC. This way you can keep the logic of the page organized and separate from the component itself. This also allows you keep data and share data across components. For example when a component is unmounted and remounted you might not want to clear data retrieved.

### SFC 
```js
<script setup>
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, ref, onMounted, watch} from 'vue'
import {getLogger} from "Logging";
import {api as notify} from "NotifyUtils"
import {store as storeLocal, api as apiLocal, registry} from './store.mjs'
import { store as storeMain,  api as apiMain} from 'GlobalStore'

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "pages/mypage.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

</script>

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
onMounted(async () => {  })
</script>

<template>
    <x-section :level="2" k="My Page" :visible="true">
        <p>This is my page</p>
    </x-section>
</template>

<style scoped>

</style>
```

### Store (store.mjs)

```js
// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import {reactive, watch, computed} from 'vue'
import {api as notify} from "NotifyUtils"
import {getLogger} from "Logging";
import {store as storeMain, api as apiMain} from 'GlobalStore'
// !# C0CKP1T_START import

// !# C0CKP1T_END import
export const registry = storeMain.r["default"]
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "/store/myservice"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// STORE
// ________________________________________________________________________________
export const store = reactive({
  id: LOG_HEADER,
  isLoading: false,
  isReady: true,
// !# C0CKP1T_START store

// !# C0CKP1T_END store
})

// ________________________________________________________________________________
// API - PRIVATE
// ________________________________________________________________________________

// ________________________________________________________________________________
// API - PUBLIC
// ________________________________________________________________________________
export const api = {
    // ________________________________________________________________________________
    // DASHBOARDS
    // ________________________________________________________________________________
    async selectDefaultDashboard() {
        logger.debug(`selectDefaultDashboard - endpoint=${store.endpoint}/homepage`)
        await registry.routeByEndpoint(`${store.endpoint}/homepage`)
    },
// !# C0CKP1T_START extra-api

// !# C0CKP1T_END

  // ________________________________________________________________________________
  // INIT
  // ________________________________________________________________________________
  async init() {
    logger.debug(`[INIT] - ${store.endpoint}`)
// !# C0CKP1T_START init

// !# C0CKP1T_END
  }

} // end of api

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (registry.state.isReady) {
    api.init()
  } else {
    setTimeout(async () => { await init() }, 1000)
  }
}
init()
```