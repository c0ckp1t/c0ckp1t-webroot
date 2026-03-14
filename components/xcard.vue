<script setup>
/*
<x-card k="Title">Content here</x-card>
<x-card k="Title" img-src="/path/to/image.png">Content here</x-card>
<x-card k="Title" :no-image="true">Content here</x-card>
*/

const props = defineProps({
  k: String,
  imgSrc: {
    type: String,
    default: null
  },
  imgAlt: {
    type: String,
    default: 'Card image'
  },
  noImage: {
    type: Boolean,
    default: false
  }
})

</script>


<template>
  <div class="card h-100">
    <!-- Show image if imgSrc is provided -->
    <img :src="imgSrc" class="card-img-top" :alt="imgAlt" v-if="imgSrc">
    <!-- Show placeholder if no imgSrc and noImage is false -->
    <div class="card-img-placeholder" v-else-if="!noImage"></div>
    <div class="card-body text-center">
      <h5 class="card-title text-warning fw-bold">{{ k }}</h5>
      <p class="card-text">
        <slot></slot>
      </p>
    </div>
  </div>
</template>


<style scoped>
.card-img-top {
  max-width: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-top: 1rem;
}

.card-img-placeholder {
  width: 200px;
  height: 150px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  background-color: var(--bs-secondary-bg, #e9ecef);
  border: 1px dashed var(--bs-border-color, #dee2e6);
  border-radius: 4px;
}

.card {
  background-color: var(--bs-dark);
  color: var(--bs-light);
  border: 1px solid var(--bs-border-color);
}

.card:hover {
  background-color: var(--bs-secondary-bg, #2d2d2d);
  color: var(--bs-light);
  border: 1px solid var(--bs-primary);
  box-shadow: 0 4px 8px rgba(var(--bs-primary-rgb, 13, 110, 253), 0.3);
}
</style>
