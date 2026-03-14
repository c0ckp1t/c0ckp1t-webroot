<script setup>
/*
isVisible: false,
<x-toggle k="View" v-model="local.isVisible"></x-toggle>
*/

import {reactive, computed, onMounted} from 'vue'

const props = defineProps({
  k: {
    type: String,
    default: "k",
  },
  modelValue: {
    default: () => {false}
  },
  icons: {
    type: Array,
    default: ["fa-eye", "fa-eye-slash"]
  }
})

const local = reactive({
    selected: false
})

const emit = defineEmits(['update:modelValue'])
const selection = computed({
           get: () => props.modelValue,
           set: (val) => {
               emit('update:modelValue', val)
           }
});

function toggle() {
  selection.value = !selection.value
}


// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
}

onMounted(async () => { init() })


</script>


<template >
  <div style="display: inline">
    <button type="button" class="btn btn-sm"
            :class="{'btn-secondary': !(props.modelValue), 'btn-success': (props.modelValue)}"
            @click.stop="toggle()" >
              <span class="icon is-small" :class="{'me-1': props.k.length > 0 }">
                  <i class="fa-solid" :class="props.icons[0]" v-if="props.modelValue"></i>
                  <i class="fa-solid" :class="props.icons[1]" v-else></i>
              </span>
             {{ props.k }}
    </button>
  </div>
</template>

<style scoped>
</style>

