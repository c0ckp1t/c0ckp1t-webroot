<script setup>
/*
myToggle3: 0,
<x-toggle3 k="View" v-model="local.myToggle3"></x-toggle2>
<x-toggle3 k="My Toggle" v-model="local.myToggle3" :icons="['fa-times', 'fa-minus', 'fa-check']"></x-toggle3>
*/

import {reactive, computed, onMounted} from 'vue'

const props = defineProps({
  k: {
    type: String,
    default: "k",
  },
  modelValue: {
    type: Number,
    default: 0
  },
  icons: {
    type: Array,
    default: ["fa-star", "fa-circle", "fa-square"]
  }
})

const emit = defineEmits(['update:modelValue'])
const selection = computed({
           get: () => props.modelValue,
           set: (val) => {
               emit('update:modelValue', val)
           }
});

function toggle() {
  selection.value = selection.value === 2 ? 0 : selection.value + 1;
}
/*
:class="{
'btn-dark': selection === 0,
    'btn-success': selection === 1,
    'btn-warning': selection === 2
}"
 */
</script>


<template >
  <div style="display: inline">
    <button type="button" class="btn btn-dark btn-sm"

            @click.stop="toggle()">
      <span class="icon is-small" :class="{'me-1': props.k.length > 0 }">
        <i class="fa-solid" :class="props.icons[selection]"></i>
      </span>
      {{ props.k }}
    </button>
  </div>
</template>

<style scoped>
.fa-solid {
  transition: all 0.2s ease-in-out;
}
.btn {
  min-width: 80px;
}
</style>

