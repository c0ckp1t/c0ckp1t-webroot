<script setup>
/*
  Usage:
    <component-view name="xinput" url="/path/to/xinput.vue">
      <x-input k="Example" v-model="local.value"></x-input>
    </component-view>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, watch} from 'vue'
import {getLogger} from "Logging"
// !# C0CKP1T_START imports

const props = defineProps({
  name: {
    type: String,
    default: 'text'
  },
  url: {
    type: String,
    default: ''
  },
  defaultExpand: {
    type: Boolean,
    default: true
  }
})
// !# C0CKP1T_END imports

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "src/pages/demo/component-view.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// !# C0CKP1T_START script
const local = reactive({
  id: LOG_HEADER,
  showCode: false,
  showContent: props.defaultExpand
})

function showCode() {
  if(local.showContent === false) {
    local.showContent = true
  }
  local.showCode = !local.showCode
}


// !# C0CKP1T_END script
</script>

<template>
  <!--  !# C0CKP1T_START template -->
  <x-section :id="props.name" :level="3" :k="props.name" class="mb-4" :visible="local.showContent">
    <template v-slot:header>
      <button v-if="props.url" class="btn btn-primary btn-sm" @click.stop="showCode">
        <i class="fa-solid fa-eye me-1"></i>Code
      </button>
    </template>

    <div class="container mb-2" v-if="local.showCode">
      <x-code  :url="props.url" lang="javascript" />
    </div>
    <div class="container mb-2">
      <slot></slot>
    </div>
  </x-section>
  <!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */

/* !# C0CKP1T_END style */
</style>
