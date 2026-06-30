<script setup>
/*
<x-json :obj="local.kv"></x-json>
<x-json :obj="local.kv" :expanded="true"></x-json>

https://www.webcomponents.org/element/@alenaksu/json-viewer
*/
import {computed, reactive, watch, onMounted, markRaw, defineAsyncComponent} from 'vue'

import 'json-viewer';

const props = defineProps({
  obj: Object,
  expanded: {
    type: Boolean,
    default:  false
  },
  copyButton: {
    type: Boolean,
    default:  true
  }
})
const emit = defineEmits(['select'])

const id  = `json${Math.floor(Math.random() * 100000000)}`

// ________________________________________________________________________________
// SANITIZE - deep-clean objects for json-viewer (handles undefined, functions,
// circular refs, symbols, and Vue reactive proxies)
// ________________________________________________________________________________
function sanitize(obj, seen = new WeakSet()) {
  if (obj === undefined) return null
  if (obj === null) return null
  if (typeof obj === 'function') return `[Function: ${obj.name || 'anonymous'}]`
  if (typeof obj === 'symbol') return obj.toString()
  if (typeof obj !== 'object') return obj
  if (obj instanceof Set) {
    return Array.from(obj).map(item => sanitize(item, seen))
  }
  // Handle circular references
  if (seen.has(obj)) return '[Circular]'
  seen.add(obj)

  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item, seen))
  }

  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitize(value, seen)
  }
  return result
}

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
    id: id,
    el: null,
    isExpanded: props.expanded,
    copied: false,
})

watch(
  () => props.obj,
  (curr, prev) => {
    // console.log(`json watch triggered`)
    local.el.data = sanitize(curr)
  },
  { deep: true }
)


// ________________________________________________________________________________
// METHODS
// ________________________________________________________________________________
function expandAll() {
    local.el.expand('**');
}
function collapseAll() {
    local.el.collapse('**');
}

function copyToClipboard() {
    const text = JSON.stringify(sanitize(props.obj), null, 2)
    navigator.clipboard.writeText(text).then(() => {
        local.copied = true
        setTimeout(() => { local.copied = false }, 1500)
    })
}

function toggleExpand() {
    if(local.isExpanded) {
        local.isExpanded = false
        collapseAll()

    } else {
        local.isExpanded = true
        expandAll()
    }
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
    // document.querySelector('#json').data = { prop1: true, prop2: 'test' };
    local.el = markRaw(document.querySelector(`#${id}`))
    local.el.data = sanitize(props.obj)
  if (local.isExpanded) {
    setTimeout(() => {
      expandAll()
    }, 100)
  }
}

onMounted(async () => { init() })

// END OF SCRIPT

</script>



<template>
  <div class="x-json">
    <button v-if="props.copyButton" class="btn btn-sm btn-outline-secondary copy-btn" @click="copyToClipboard">
      <i class="fa-solid" :class="local.copied ? 'fa-check' : 'fa-copy'"></i>
    </button>
    <json-viewer class="p-1" :id="local.id"> </json-viewer>
  </div>
</template>

<style scoped>
.x-json {
  position: relative;
}
.copy-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
}
</style>
