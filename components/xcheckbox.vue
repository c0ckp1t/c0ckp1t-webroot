<script setup>
/*
<x-checkbox k="My Check Box" v-model="local.myCheckBox"></x-checkbox>
<x-checkbox k="My Check Box" v-model="local.myCheckBox" inline></x-checkbox>
<x-checkbox k="My Check Box" v-model="local.myCheckBox" disabled></x-checkbox>
*/

import { ref, computed } from 'vue'
import { generateRandomId } from "JsUtils"

const props = defineProps({
  modelValue: { 
    type: Boolean,
    default: false
  },
  k: {
    type: String,
    default: "Check Box"
  },
  inline: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const id = ref(`id${generateRandomId()}`)

const emit = defineEmits(['update:modelValue'])
const v = computed({
           get: () => props.modelValue,
           set: (val) => {
               emit('update:modelValue', val)
           }
});


</script>


<template>
  <span :class="['form-check', { 'form-check-inline': inline }]" class="x-checkbox">
    <input class="form-check-input" type="checkbox" v-model="v" :id="id" :disabled="disabled">
    <label class="form-check-label" :for="id">{{ k }}</label>
  </span>
</template>

<style scoped></style>

