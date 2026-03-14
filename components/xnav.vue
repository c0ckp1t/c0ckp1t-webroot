<script setup>
/*
v-model is a String that determine which item is selected.
  We use v-model instead of emit so that we can programmatically select item

arr is the list of items to display. It is a list of objects with the following schema:
[
  { id: "item1", label: "Item 1", },
  { id: "item1", label: "Item 1", },
]

<x-nav :arr="local.xnav" v-model="local.xNavSel" :isVertical="true"></x-nav>
<x-nav :arr="local.navItems" v-model="local.navSel"><x-nav>

*/
import {reactive, ref, computed} from 'vue'

const props = defineProps({
  isVertical: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "item1"
  },
  arr: {
    type: Array,
    default: [
      {id: "item1", label: "Item 1"},
      {id: "item2", label: "Item 2"}
    ]
  }
})

// const id = ref(`id${generateRandomInt32()}`)

const emit = defineEmits(['update:modelValue', 'callback'])
const v = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
});

function select(item) {
  // console.log(`[${id}] - selected - ${item.id}`)
  if (v.value === item.id) {
    v.value = null
  } else {
    emit('callback', item.id)
    v.value = item.id
  }
}


</script>


<template>
  <nav class="nav custom-nav" :class="{'flex-column': props.isVertical}">
    <a v-for="item in props.arr" class="nav-link" :class="{'active': item.id === v}" @click="select(item)">
      {{ item.label }}
    </a>
  </nav>
</template>

<style scoped>


.custom-nav {
  border-radius: 0.375rem;
  background-color: #f8f9fa;
  padding: 0.5rem;
}

.nav-link.active {
  background-color: #0d6efd;
  color: white;
  font-weight: 600;
}

.nav-link:hover {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.nav-link {
  color: #495057;
  font-weight: 500;
  border-radius: 0.25rem;
  margin: 0.125rem 0;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
</style>

