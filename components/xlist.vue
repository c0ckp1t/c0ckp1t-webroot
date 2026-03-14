<script setup>
/*
<x-list k="Tags" v-model="local.tags"></x-list>
*/
// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import {computed, onMounted, reactive} from 'vue';

const props = defineProps({
    k: String,
    modelValue: {
      default: () => {
        "N/A"
      }
    },
  }
)

const defaultValue = "default Value"
// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  isLoading: false,
  newItem: '',
})

//const emit = defineEmits(['update:modelValue'])
//const kv = computed({
//  get: () => props.modelValue,
//  set: (val) => {
//    emit('update:modelValue', val)
//  }
//});

// ________________________________________________________________________________
// METHODS
// ________________________________________________________________________________
function addItem() {
  if (local.newItem.trim() === '') return;
  props.modelValue.push(local.newItem.trim());
  local.newItem = '';
}

function removeItem(index) {
  props.modelValue.splice(index, 1);
}

</script>

<template>
  <div>
    <form @submit.prevent="addItem">
      <div class="input-group mb-3">
        <label class="input-group-text mb-0 d-flex align-items-center fw-bold" id="basic-addon1" for="itemInput">{{k}}</label>
        <input
          type="text"
          class="form-control"
          aria-label="Item"
          aria-describedby="basic-addon1"
          placeholder="Add new item"
          v-model="local.newItem"
        />
        <button class="btn btn-primary" type="submit"> Add </button>
      </div>
    </form>

    <div class="row">
      <div class="item col-auto"  v-for="(item, index) in  props.modelValue"   :key="index">
        {{ item }}
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="removeItem(index)"
        ></button>
      </div>
    </div>


  </div>
</template>
