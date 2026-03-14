<script setup>
/*
<x-input k="k" v-model="local.xInputText"></x-input>
<x-input k="k" v-model="local.xInputTextNumber" type="Number"></x-input>
<x-input k="k" v-model="local.xInputText" :showLabel="false"></x-input>
<x-input k="k" v-model="local.xInputText"
         :styleObject="{'border': '1px solid red'}"
         :inputStyle="{'border': '1px solid green'}">

</x-input>
*/

import {computed, ref} from 'vue';

const props = defineProps({
  k: String,
  modelValue: { 
    default: () => { "N/A" } 
  },
  type: {
    type: String,
    default: 'text'
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  styleObject: {
    type: Object,
    default: {
      'min-width': '150px'
    }
  },
  inputStyle: {
    type: String,
    default: ""
  }
})

const isPasswordVisible = ref(false)

const emit = defineEmits(['update:modelValue'])
const message = computed({
           get: () => props.modelValue,
           set: (val) => {
               emit('update:modelValue', val)
           }
});

const typeCheck = computed (() => {
  if(message.value === "")  return "BLANK"
  return "DEFAULT"
})


</script>


<template >
<div class="input-group x-input2" >
  <span v-if="showLabel" :style="props.styleObject" class=" input-group-text label fw-bold"  > {{ k }} </span>

  <input :type="type" aria-label="message" class="form-control"
         :style="props.inputStyle" v-model.number="message" v-if="type.toUpperCase() === 'NUMBER'">

  <input :type="isPasswordVisible ? 'text' : 'password'"  aria-label="message" class="form-control"
         :style="props.inputStyle" v-model="message" v-else-if="type.toUpperCase() === 'PASSWORD'">

  <input :type="type" aria-label="message" class="form-control"
         :style="props.inputStyle" v-model="message" v-else>

  <div class="input-group-text text-dark icon-container" @click="isPasswordVisible = !isPasswordVisible" v-if="type.toUpperCase() === 'PASSWORD'">
    <i class="fa-solid fa-eye" v-if="isPasswordVisible"></i>
    <i class="fa-solid fa-eye-slash" v-if="!isPasswordVisible"></i>
  </div>
  <span class="input-group-text type-check" v-if="typeCheck !== 'DEFAULT'">{{ typeCheck }}</span>
</div>
</template>


<style scoped>

.label:hover {
  cursor: pointer;
}

.input-group-text {
  min-width: 150px;
}

.type-check {
  min-width: 50px;
  font-size: .5rem;
}

.icon-container {
  min-width: auto;
  width: auto;
  padding: 0.375rem 0.75rem;
}
</style>
