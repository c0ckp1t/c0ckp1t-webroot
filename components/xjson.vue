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
  }
})
const emit = defineEmits(['select'])

const id  = `json${Math.floor(Math.random() * 100000000)}`

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
    id: id,
    el: null,
    isExpanded: props.expanded,
})

watch(
  () => props.obj,
  (curr, prev) => {
    // console.log(`json watch triggered`)
    local.el.data =  {... curr }
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
    local.el.data = props.obj
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
<!--     <button @click="toggleExpand">Toggle Expand</button>-->
    <json-viewer class="p-1" :id="local.id"> </json-viewer>
  </div>
</template>

<style scoped>

</style>
