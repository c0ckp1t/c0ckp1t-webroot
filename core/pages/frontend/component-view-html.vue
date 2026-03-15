<script setup>
/*
  Usage:
    <component-view-html name="buttons">
      <button class="btn btn-primary">Example</button>
    </component-view-html>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, ref, watch, nextTick} from 'vue'
import {getLogger} from "Logging"
// !# C0CKP1T_START imports

const props = defineProps({
  name: {
    type: String,
    default: 'text'
  },
  defaultExpand: {
    type: Boolean,
    default: false
  }
})
// !# C0CKP1T_END imports

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "frontend/component-view-html.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// !# C0CKP1T_START script
const local = reactive({
  id: LOG_HEADER,
  showHtml: false,
  showContent: props.defaultExpand
})

const slotContainer = ref(null)
const sourceHtml = ref('')

function formatHtml(html) {
  html = html.replace(/\s*data-v-[a-f0-9]+=""/g, '')
  let formatted = ''
  let indent = 0
  const tags = html.replace(/>\s*</g, '>\n<').split('\n')
  for (const tag of tags) {
    const trimmed = tag.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('</')) indent--
    formatted += '  '.repeat(Math.max(indent, 0)) + trimmed + '\n'
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) indent++
  }
  return formatted.trim()
}

async function showHTML() {
  local.showHtml = !local.showHtml
  if (local.showHtml) {
    local.showContent = true
    await nextTick()
    sourceHtml.value = formatHtml(slotContainer.value?.innerHTML ?? '')
  }
}

watch(() => local.showContent, (showContent) => {
  if (!showContent) {
    local.showHtml = false
  }
})

// !# C0CKP1T_END script
</script>

<template>
  <!--  !# C0CKP1T_START template -->
  <x-section :id="props.name" :level="3" :k="props.name" class="mb-4" :visible="local.showContent">
    <template v-slot:header>
      <button class="btn btn-primary btn-sm" @click.stop="showHTML">
        <i class="fa-solid fa-code me-1"></i>HTML
      </button>
    </template>

    <div class="container mb-2" v-if="local.showHtml">
      <pre><code>{{ sourceHtml }}</code></pre>
    </div>
    <div class="container mb-2" ref="slotContainer">
      <slot></slot>
    </div>
  </x-section>
  <!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */

/* !# C0CKP1T_END style */
</style>
