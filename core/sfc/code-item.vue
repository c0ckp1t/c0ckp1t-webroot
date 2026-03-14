<script setup>
import {computed, defineProps, reactive, onMounted} from 'vue'

import {store as storeMain, api as apiMain } from 'GlobalStore'
import {getLogger} from "Logging";

const props = defineProps({
  url: {type: String, required: true},
  lang: {type: String, default: 'text'},
  startLine: {type: [Number, String], default: null}, // note: start line is 0 indexed, most editors are 1 indexed
  endLine: {type: [Number, String], default: null},
})
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'code-item.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
// !# C0CKP1T_START local
  code: "Not Available",
  lang: props.lang,
  fullCode: "N/A",
  fullView: false,
  hasError: false,
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
const registry = storeMain.r['default']
async function findCode() {
  if (typeof props.url !== 'string' || props.url.length < 3) {
    local.fullCode = `[INVALID_URL] - problem with props.url\n\n`
    local.hasError = true
    return
  }
  logger.info(`[findCode] - ${props.url}`)
  const resp = await registry.getText( props.url)

  // const resp = await docUtils.retrieveText(storeMain, "Introduction.md", props.url)
  logger.info(resp)
  if (!resp.isOk) {
    local.fullCode = `[API_ERROR]\n${resp.result}\n\n`
    local.hasError = true
    return
  }
  // Get the full code
  local.fullCode = resp.result
  local.hasError = false
}

// // Highlighter function. Should return escaped HTML
const html = computed(() => {
  // console.log("Recomputing HTML")
  // console.log(props)
  // Handle line range if specified
  let code = local.fullCode
  if (local.fullCode && local.fullView === false) {
    const lines = local.fullCode.split('\n')
    const start = props.startLine != null ? parseInt(props.startLine) : 0
    const end = props.endLine != null ? parseInt(props.endLine) + 1 : lines.length // +1 because slice excludes end

    // console.log(`slice - start=${start} - end=${end}`)
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
  <div>
    <div class="code-item container" >

      <div class="row mb-0 mt-0 pt-0 pb-0 align-items-center" v-if="!local.fullView">
        <div class="col-auto">
          <span class="filename">{{ props.url?.split('/').pop() ?? 'INVALID' }}</span>
        </div>
        <div class="col"></div>
        <div class="col-auto">
          <ExecButton class="btn-sm btn btn-dark" icon="fa-rotate-right" :callback="() => findCode()"></ExecButton>
        </div>
        <div class="col-auto">
          <x-toggle k="Full" v-model="local.fullView"></x-toggle>
        </div>
      </div>

      <div class="full-view mb-0 pb-0 mt-0 pt-0" v-else>

        <div class="row align-items-center">
          <div class="col-auto">
            <span class="filename">{{ props.url ?? 'INVALID' }}</span>
          </div>
          <div class="col"></div>
          <div class="col-auto">
            <ExecButton icon="fa-rotate-right" :callback="() => findCode()"></ExecButton>
          </div>
          <div class="col-auto">
            <x-toggle k="Full" v-model="local.fullView"></x-toggle>
          </div>
        </div>

        <div class="row align-items-center">
          <div class="col-auto">
            <x-label :isCompact="true" k="Lang:">{{ local.lang }}</x-label>
          </div>
          <div class="col-auto" v-if="props.startLine && props.endLine">
            <x-label :isCompact="true" k="Lines:">{{ props.startLine }}-{{ props.endLine }}</x-label>
          </div>
        </div>

      </div>

      <div v-html="html"></div>

    </div> <!-- code-item -->

  </div>
</template>

<style scoped>
.code-item {
  color: white;
  border: 1px solid black;
  background-color: #434e5a;
}

</style>