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
import {reactive} from 'vue'
import {getLogger} from "Logging"
// !# C0CKP1T_START imports

const props = defineProps({
  name: {
    type: String,
    default: 'text'
  },
  url: {
    type: String,
    default: '/v4/webroot/assets/ui/xinput.vue'
  },
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
})
// !# C0CKP1T_END script
</script>

<template>
  <!--  !# C0CKP1T_START template -->
  <x-section :id="props.name" :level="3" :k="props.name" class="mb-4">
    <template v-slot:header>
      <button class="btn btn-light btn-sm" @click.stop="local.showCode = !local.showCode">
        <i class="fa-solid fa-eye me-1"></i>Code
      </button>
    </template>

    <div class="container mb-2" v-if="local.showCode">
      <x-markdown :v="`<CodeItem url=${props.url} lang=javascript></CodeItem>`"></x-markdown>
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
