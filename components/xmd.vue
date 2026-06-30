<script setup>
/*
  <XMd url="/docs/Introduction.md" />

*/

import {computed, defineProps, reactive, onMounted} from 'vue'

import {store as storeMain, api as apiMain } from 'GlobalStore'
import {getLogger} from "Logging";

const props = defineProps({
  url: {type: String, required: true},
  instanceId: {type: String, required: false, default: "default"}
})

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'xmd.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
// !# C0CKP1T_START local
  hasError: false,
  fullCode: "N/A",
// !# C0CKP1T_END local
})


async function findCode() {
  const registry = storeMain.r[props.instanceId]

  if (typeof props.url !== 'string' || props.url.length < 3) {
    local.fullCode = `[INVALID_URL] - problem with props.url\n\n`
    local.hasError = true
    return
  }
  logger.debug(`[findCode] - ${props.url}`)
  const resp = await registry.getText( props.url)
  logger.debug(resp)
  if (!resp.isOk) {
    local.fullCode = `[API_ERROR]\n${resp.result}\n\n`
    local.hasError = true
    return
  }
  // Get the full code
  local.fullCode = resp.result
  local.hasError = false
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
onMounted(() => {
  findCode()
})

</script>

<template>
  <div>
      <XMarkdown :v="local.fullCode" />
  </div>
</template>

<style scoped>

</style>