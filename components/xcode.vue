<script setup>
import {computed,  reactive, onMounted} from 'vue'

import {store as storeMain, api as apiMain} from '@/GlobalStore.mjs'
import {getLogger} from "../core/Logging.mjs"

const props = defineProps({
  url: {type: String, required: true},
  lang: {type: String, default: 'text'},
  startLine: {type: Number, default: null}, // note: start line is 0 indexed, most editors are 1 indexed
  endLine: {type: Number, default: null},
})

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'xcode.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("INIT")

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: "xcode.vue",
  isLoading: false,
// !# C0CKP1T_START local
  code: "Not Available",
  lang: props.lang,
  fullCode: "N/A",
  fullView: false
// !# C0CKP1T_END local
})


const HTML_ESCAPE_TEST_RE = /[&<>"]/
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g
const HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch]
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar)
  }
  return str
}

async function findCode() {
  if (typeof props.url !== 'string' || props.url.length < 3) {
    local.fullCode = `[INVALID_URL] - problem with props.url\n\n`
  }

  const resp = await apiMain.fetchText(props.url)
  logger.debug(resp)
  if (!resp.isOk) {
    if (resp.result.includes('File does not exist')) {
    } else {
      logger.error(resp)
      return
    }
  }
  local.fullCode = resp.result
}

// // Highlighter function. Should return escaped HTML
const html = computed(() => {
  console.log("Recomputing HTML")
  console.log(props)
  // Handle line range if specified
  let code = local.fullCode
  if (local.fullCode && local.fullView === false) {
    const lines = local.fullCode.split('\n')
    const start = props.startLine != null ? props.startLine : 0
    const end = props.endLine != null ? props.endLine + 1 : lines.length // +1 because slice excludes end

    // Extract only the lines we want
    code = lines.slice(start, end).join('\n')
  }

  if (local.lang && hljs.getLanguage(local.lang)) {
    try {
      return '<pre class="hljs"><code>' +
          hljs.highlight(code, {language: props.lang, ignoreIllegals: true}).value +
          '</code></pre>';
    } catch (__) {
    }
  }

  return '<pre class="hljs"><code>' + escapeHtml(local.code) + '</code></pre>';
})
// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
onMounted(() => {
  findCode()
})

</script>

<template>
  <div class="code-item">
    <div class="row mb-2">
      <div class="col-auto">
        <x-label :isCompact="true" k="File:">{{ props.url ?? 'INVALID' }}</x-label>
      </div>
      <div class="col">
      </div>
      <div class="col-auto">
        <x-label :isCompact="true" k="Lang:">{{ local.lang }}</x-label>
      </div>
      <div class="col-auto" v-if="props.startLine && props.endLine">
        <x-label :isCompact="true" k="Lines:">{{ props.startLine}}-{{props.endLine}}</x-label>
      </div>
      <div class="col-auto">
        <ExecButton icon="fa-rotate-right" :callback="() => findCode()"></ExecButton>
      </div>
      <div class="col-auto">
        <x-toggle k="Full" v-model="local.fullView"></x-toggle>
      </div>
    </div>
    <div v-html="html"></div>
  </div>
</template>

<style scoped>
.code-item {
  border: 1px solid black;
  padding: 2px;
}

</style>