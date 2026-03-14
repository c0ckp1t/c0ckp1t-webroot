<script setup>
/*
Output Only, used as an indicator.
<x-check k="My Check Box" :v="local.myCheckBox"></x-check>
*/

import {reactive, computed} from 'vue'

const props = defineProps({
  v: Boolean,
})

const emit = defineEmits(['click'])

function onClick() {
  emit("click", props.v)
}

</script>


<template >
  <button class="btn btn-sm"
          :class="{'btn-dark': !(props.v), 'btn-success': (props.v)}"
          @click="onClick()" >
            <span class="icon">
                <i class="fa-solid fa-check" v-if="props.v"></i>
                <i class="fa-solid fa-x" v-else></i>
            </span>
  </button>
</template>

<style scoped>
</style>

