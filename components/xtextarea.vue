<script setup>
/*
<x-textarea k="Description" :lines="5" v-model="local.config.description"></x-textarea>
*/

import {computed} from 'vue';

const props = defineProps({
  k: String,
  modelValue: {
    default: () => ""
  },
  lines: {
    type: Number,
    default: 3
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  styleObject: {
    type: Object,
    default: () => ({
      'min-width': '150px'
    })
  },
  inputStyle: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(['update:modelValue'])
const message = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
});

const typeCheck = computed(() => {
  if (message.value === "") return "BLANK"
  return "DEFAULT"
})
</script>

<template>
  <div class="mb-3">
    <label v-if="showLabel" :style="props.styleObject" class="form-label fw-bold">{{ k }}</label>
    <div class="input-group">
      <textarea
          :rows="lines"
          :placeholder="placeholder"
          aria-label="message"
          class="form-control"
          :style="props.inputStyle"
          v-model="message"
          resize="vertical">
      </textarea>
    </div>
    <span class="input-group-text type-check" v-if="typeCheck !== 'DEFAULT'">{{ typeCheck }}</span>
  </div>
</template>

<style scoped>
label:hover {
  cursor: pointer;
}

.type-check {
  min-width: 50px;
  font-size: .5rem;
}

textarea.form-control {
  resize: vertical;
  min-height: auto;
}
</style>