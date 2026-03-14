<script setup>

/*
  Usage:
    <x-hidden :k="`Services (${props.v.services.length})`" >
      This is hidden text
    </x-hidden>
*/
import { ref, watch, computed, useSlots } from 'vue';

const props = defineProps({
    k: String
})

// const slots = useSlots();
// const children = slots.default()[0].children;

</script>


<template >
  <details>
    <summary><span data-key>{{k}}</span><span data-value></span></summary>
    <slot></slot>

  </details>
</template>


<style scoped></style>
