<script setup>
/*
<x-card-h k="Title" date="2024-01-01" :tags="['vue', 'js']">Content here</x-card-h>
<x-card-h k="Title" img-src="/path/to/image.png">Content here</x-card-h>
<x-card-h k="Title" :no-image="true">Content here</x-card-h>
*/

import {ref} from 'vue';

const props = defineProps({
  k: String,
  date: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  tags: {
    type: Array,
    default: () => []
  },
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

const imageError = ref(false)

function handleImageError() {
  imageError.value = true
}

</script>


<template>
  <div class="card-h-wrapper">
    <div class="card w-100">
      <div class="row g-0 align-items-center">

        <div class="col-md-2 col-sm-3 image-col" v-if="!noImage">
          <!-- Show image if imgSrc is provided and no error -->
          <img 
            v-if="imgSrc && !imageError" 
            :src="imgSrc" 
            class="card-img" 
            :alt="imgAlt"
            @error="handleImageError"
          >
          <!-- Show placeholder if no imgSrc or image failed to load -->
          <div v-else class="card-img-placeholder"></div>
        </div>

        <div :class="noImage ? 'col-12' : 'col-md-10 col-sm-9'">
          <div class="card-body text-start">
            <div class="row align-items-center">
              <div class="col">
                <h5 class="card-title text-warning fw-bold mb-0">{{ k }}</h5>
              </div>
              <div class="col-auto" v-if="date">
                <span class="badge-pill date-badge">{{ date }}</span>
              </div>
              <div class="col-auto" v-if="author">
                <span class="badge-pill author-badge">{{ author }}</span>
              </div>
            </div>
            <p class="card-text mt-2 mb-2">
              <slot></slot>
            </p>
            <div v-if="tags && tags.length > 0">
              <span v-for="tag in tags" :key="tag" class="tag-tab">{{ tag }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<style scoped>
.card-h-wrapper {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
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

.image-col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.card-img {
  max-width: 100%;
  max-height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.card-img-placeholder {
  width: 100%;
  max-width: 120px;
  height: 100px;
  background-color: var(--bs-secondary-bg, #2d2d2d);
  border: 1px dashed var(--bs-border-color, #444);
  border-radius: 4px;
}

.tag-tab {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.2em 0.8em;
  background: var(--bs-secondary-bg, #2d2d2d);
  color: var(--bs-info);
  border-radius: 1em;
  border: 1px solid var(--bs-info);
  margin-right: 0.25em;
  margin-bottom: 0.2em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.tag-tab:hover {
  background: var(--bs-info);
  color: var(--bs-dark);
}

.badge-pill {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.2em 0.8em;
  border-radius: 1em;
  margin-right: 0.25em;
  margin-bottom: 0.2em;
}

.date-badge {
  background: var(--bs-secondary-bg, #2d2d2d);
  color: var(--bs-info);
  border: 1px solid var(--bs-info);
}

.author-badge {
  background: var(--bs-secondary-bg, #2d2d2d);
  color: var(--bs-warning);
  border: 1px solid var(--bs-warning);
}
</style>
