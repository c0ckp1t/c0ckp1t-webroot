<script setup>
/*
<ExecButton icon="fa-heart me-1"  :callback="() => health()">Health</ExecButton>
<ExecButton class="btn btn-primary" icon="fa-heart me-1"  :callback="() => health()">Health</ExecButton>

import { api as notify } from "NotifyUtils"
async function health() {
    const args = ["health",]
    const resp = await apiRegistry.exec(storeLocal.endpoint, args)
    logger.info(resp)
    if (!resp.isOk) {
        notify.badDetails(`[${storeLocal.id}] - health failed`, `${resp.result}`)
        return
    }
}

*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {ref} from 'vue'

const props = defineProps({
  callback: {
    type: Function,
    default: () => Promise.resolve() // fallback no-op
  },
  icon: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: "btn btn-primary"
  }, // Allow class to be passed as a prop
})


const localIsLoading = ref(false)

async function buttonClick() {
  try {
    localIsLoading.value = true
    await props.callback()
  } catch(e) {
    console.log('ExecButton error:', e)
  } finally {
    localIsLoading.value = false
  }
}

</script>

<template>
  <button :class="props.class" class="x-button" @click.stop="buttonClick()">
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="localIsLoading"></span>
    <span class="icon" v-if="!localIsLoading && props.icon"> <i class="fa-solid me-1" :class="props.icon"></i> </span>
    <slot></slot>
  </button>
</template>

<style scoped></style>
