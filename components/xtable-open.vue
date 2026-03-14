<script setup>
/*
      <x-table-open :exclude="[]" :arr="local.myTableData" v-slot="slotProps">
        {{ local.myTableData[slotProps.v] }}
      </x-table-open>

<div v-if="local.myTableData.length === 0">
   <h3>No Items</h3>
 </div>

      <x-table-open :exclude="[]" :arr="local.myTableData" >

        <template v-slot:name="props">
          <span style="font-weight: bold">{{props}}</span>
        </template>

        <template v-slot:default="slotProps">
          <span > {{slotProps}}</span>
        </template>

      </x-table-open>

*/

// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import {computed, onMounted, reactive, watch} from 'vue';

const props = defineProps({
  // expect an array of Objects
  arr: {
    type: Array,
    default: []
  },
  idField: {
    type: String,
    default: "id"
  },
  exclude: {
    type: Array,
    default: []
  },
  // slots: {
  //   type: Array,
  //   default: []
  // },
  noOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  isLoading: false,
  id: "xtable-open",

  componentKey: 0,
  selectedId: null,
  // namedSlots: new Set(props.slots)
})

watch(() => props.arr.length, (newArr) => {
  local.selectedId = null
}, { deep: true })

const partA = computed(() => {
  // console.log(`part A slicing ${local.selectedId}`)
  const id = local.selectedId
  if (id === null) {
    return props.arr
  } else {
    return props.arr.slice(0, id+1);
  }
})

const partB = computed(() => {
  // console.log(`part B slicing ${local.selectedId}`)
  const id = local.selectedId
  if (id === null) {
    return [];
  } else {
    return props.arr.slice(id+1);
  }
})

function rowSelect(id) {
  if(props.noOpen === true) return
  // console.log(`[${local.id}] - selected - ${id}`)
  if (local.selectedId === id) {
    local.selectedId = null
  } else {
    local.selectedId = id
  }
  emit('select', local.selectedId)
}

// Get keys from the first element of arr
const keys = computed(() => {
  if (props.arr !== null && props.arr !== undefined && props.arr.length > 0) {
    return Object.keys(props.arr[0]).filter (key => !props.exclude.includes(key))
  } else {
    return []
  }
})


// ________________________________________________________________________________
// METHODS
// ________________________________________________________________________________

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
}

onMounted(async () => {
  init()
})

</script>


<template>
  <div class="">

    <table class="table table-hover">
      <thead>
      <tr>
        <th scope="col" v-for="k in keys">{{ k }}</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(item, i) in partA" :key="item.id" @click.prevent="rowSelect(i)"
          :class="{'table-active': local.selectedId === i}">

        <td v-for="k in keys" >
          <span v-if="Object.keys($slots).includes(k)">
            <slot :idx="i" :v="item[k]" :name="k" :rowId="item[props.idField]">N/A</slot>
          </span>
          <span v-else>
          {{ item[k] }}
          </span>
        </td>
      </tr>

      <tr  v-if="local.selectedId !== null">
        <td  :colspan="keys.length">
          <slot  :v="local.selectedId" :rowId="props.arr[local.selectedId][props.idField]"></slot>
        </td>
      </tr>

      <tr  v-for="(item,i) in partB" :key="item.id" @click.prevent="rowSelect(local.selectedId + 1 + i)"
          :class="{'table-active': local.selectedId === i}">

        <td v-for="k in keys" >
          <span v-if="Object.keys($slots).includes(k)">
            <slot :idx="i" :v="item[k]" :name="k" :rowId="item[props.idField]">N/A</slot>
          </span>
          <span v-else>
          {{ item[k] }}
          </span>
        </td>

      </tr>


      </tbody>
    </table>

  </div>
</template>
