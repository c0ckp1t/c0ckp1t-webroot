<script setup>
/*
Usage:

 */
import {computed} from 'vue'

const props = defineProps({
  colorName: {type: String, required: true},
  colorLabel: {type: String, required: true},
  disabled: {type: Boolean, default: false},
  modelValue: {
    default: () => { "N/A"}
  },
})

const emit = defineEmits(['update:modelValue'])
const colorValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
});

</script>

<template>
  <label :for="`color-${colorName}`" class="color-label">{{ colorLabel }}</label>
  <div class="color-input-wrapper">
    <input
        type="color"
        :id="`color-${colorName}`"
        v-model="colorValue"
        class="color-input"
        :disabled="props.disabled"
    >
    <input
        type="text"
        v-model="colorValue"
        class="hex-input form-control"
        maxlength="7"
        :disabled="props.disabled"
    >
  </div>
</template>

<style scoped>
.color-label {
  font-weight: 600;
  color: var(--bs-body-color);
  margin-bottom: 0;
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-input {
  width: 50px;
  height: 40px;
  border: 2px solid var(--bs-border-color);
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
  background: var(--bs-body-bg);
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.hex-input {
  width: 100px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}
</style>
