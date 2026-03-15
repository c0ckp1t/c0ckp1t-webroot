<script setup>
import {computed, defineProps, reactive} from 'vue'
import {getLogger} from "Logging";

const props = defineProps({
  title: {type: String, required: true, default: "Code"},
  lang: {type: String, default: 'text'},
  code: {type: String, required: true},
})
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'xcode-slot.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  lang: props.lang,
  copied: false,
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

// ________________________________________________________________________________
// COPY TO CLIPBOARD
// ________________________________________________________________________________
async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    local.copied = true
    logger.debug("[copyCode] - copied to clipboard")
    setTimeout(() => { local.copied = false }, 2000)
  } catch (err) {
    logger.error("[copyCode] - failed to copy", err)
  }
}

// ________________________________________________________________________________
// HIGHLIGHTED HTML
// ________________________________________________________________________________
const html = computed(() => {
  const code = props.code || ''

  if (local.lang && hljs.getLanguage(local.lang)) {
    try {
      return '<pre class="hljs"><code>' +
          hljs.highlight(code, {language: local.lang, ignoreIllegals: true}).value +
          '</code></pre>';
    } catch (__) {
    }
  }

  return '<pre class="hljs"><code>' + escapeHtml(code) + '</code></pre>';
})

</script>

<template>
  <div>
    <div class="code-item container">

      <div class="row mb-0 mt-0 pt-0 pb-0 align-items-center">
        <div class="col-auto">
          <span class="code-title">{{ props.title }}</span>
        </div>
        <div class="col"></div>
        <div class="col-auto">
          <button class="btn btn-sm btn-dark copy-btn" @click="copyCode" :title="local.copied ? 'Copied!' : 'Copy to clipboard'">
            <i :class="local.copied ? 'fa fa-check' : 'fa fa-copy'"></i>
            <span v-if="local.copied" class="copy-feedback">Copied!</span>
          </button>
        </div>
      </div>

      <div v-html="html"></div>

    </div> <!-- code-item -->
  </div>
</template>

<style scoped>
.code-item {
  border: 1px solid black;
}

.code-title {
  font-weight: bold;
  font-size: 0.9em;
}
</style>
