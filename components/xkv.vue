<script setup>
/*
<x-kv k="local" :obj="local.myMap"></x-kv>
 */
//________________________________________________________________________________ 
// IMPORTS
//________________________________________________________________________________ 
import { computed } from 'vue';

const props = defineProps({
  obj: Object,
  k: {
    type: String,
    default: () => "Default Title"
  }
})

</script>


<template >
  <div class="kv">
    <span class="ms-1 fw-bold">{{ props.k }}</span>
    <div v-for="(v, k) in props.obj">
      <div class="input-group g-0 ps-2">
        <span class="fw-bold input-group-text">{{ k }}</span>
        <span class="input-group-text">{{ v }} </span>
      </div>
    </div>
  </div>
</template>


<style scoped>
.input-group-text {
  background-color: transparent;
  border: none;
  padding: 0.175rem 0.35rem;

}
</style>
