<script setup>
/*
  types: [
    {k: "STRING", v: "STRING"},
    {k: "JSON", v: "JSON"},
    {k: "NUMBER", v: "NUMBER"},
  ]
<x-drop-down k="Route Type: " :items="['STATIC', 'SIMPLE']" v-model="local.routeType"></x-drop-down>

*/
import {computed, reactive, onMounted} from 'vue'

const props = defineProps({
// [{k: 'item1key', v: 'item1'}, {k: 'item2key', v: 'item2'}]
  items: {
    type: Array,
    default: []
  }, 
  k: String,
  modelValue: { 
    default: () => { "N/A" } 
  },
})

// ________________________________________________________________________________
// LOCAL STATE 
// ________________________________________________________________________________
const local = reactive({
    visible: false
})

const emit = defineEmits(['update:modelValue'])
const selection = computed({
           get: () => valueToKeyMap(props.modelValue),
           set: (val) => {
               emit('update:modelValue', keyToValueMap(val))
           }
});

function valueToKeyMap(v) {
  const obj = props.items.filter( obj => { 
    return (obj.v === v) 
  })
  if(obj.length === 1) {
    return obj[0].k
  }
  return `Select Item (value=${v} not found)`
}

function keyToValueMap(k) {

  const obj = props.items.filter( obj => { 
    return (obj.k === k) 
  })
  if(obj.length === 1) {
    return obj[0].v
  }
  throw `key=${k} not found`
}

// ________________________________________________________________________________
// METHODS
// ________________________________________________________________________________
function toggleVisible() {
  local.visible = !local.visible
}

function select(item) {
  local.visible = false
  selection.value = item.k
}


// ________________________________________________________________________________ 
// INIT
// ________________________________________________________________________________ 
async function init() {
}

onMounted(async () => { init() })

// END OF SCRIPT
</script>


<template >

<div class="dropdown">
  <span class="pe-4 fw-bold" v-if="props.k"> {{ props.k }} </span>
  <button class="btn btn-sm btn-secondary dropdown-toggle" @click="toggleVisible()" type="button" id="dropdownMenuButton1" data-bs-auto-close="true" data-bs-toggle="dropdown" aria-expanded="false">
    {{ selection === "" ? "Select Item" : selection}}
  </button>
  <ul class="dropdown-menu" :class="{show: local.visible}" aria-labelledby="dropdownMenuButton1">
    <li v-for="obj in props.items">
      <a class="dropdown-item" @click="select(obj)">{{obj.k}}</a>
    </li>
  </ul>
</div>


</template>

<style scoped>
</style>
