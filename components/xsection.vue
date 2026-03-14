<script setup>

/*
    Usage examples:
    
    <!-- Simple usage with heading level (1-6, similar to h1-h6) -->
    <x-section :level="1" k="Page Title"></x-section>
    <x-section :level="2" k="Major Section"></x-section>
    <x-section :level="3" k="Section"></x-section>
    <x-section :level="4" k="Subsection"></x-section>
    <x-section :level="5" k="Minor Subsection"></x-section>
    <x-section :level="6" k="Smallest Heading"></x-section>
    
    <!-- With color override -->
    <x-section :level="3" color="danger" k="Warning Section"></x-section>
    
    <!-- With header slot for buttons/actions -->
    <x-section :level="3" k="Configuration">
      <template v-slot:header>
        <button class="btn btn-light btn-sm ms-4">Save</button>
      </template>
      
      <x-input k="Port" type="Number" v-model="local.config.port"></x-input>
    </x-section>
    
    Heading Level Defaults:
    Level 1: fs-1, bg-primary, text-light  (Page title)
    Level 2: fs-2, bg-primary, text-light  (Major section)
    Level 3: fs-3, bg-secondary, text-light (Section)
    Level 4: fs-4, bg-secondary, text-light (Subsection)
    Level 5: fs-5, bg-body-secondary, text-body (Minor subsection)
    Level 6: fs-6, bg-body-tertiary, text-body-secondary (Smallest)
*/

// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, watch} from 'vue'

const props = defineProps({
  k: {
    type: String,
    default: () => "Default Title"
  },
  visible: {
    type: Boolean,
    default: () => true
  },
  level: {
    type: Number,
    default: 3,
    validator: (value) => value === null || (value >= 1 && value <= 6)
  },
  color: {
    type: String,
    default: null // Optional override: 'primary', 'secondary', 'success', 'danger', 'warning', 'info'
  },
})

// ________________________________________________________________________________
// LEVEL CONFIGURATION
// ________________________________________________________________________________
const levelConfig = {
  1: { fontSize: 'fs-1', bgClass: 'bg-primary', textClass: 'text-light', btnClass: 'btn-primary' },
  2: { fontSize: 'fs-2', bgClass: 'bg-primary', textClass: 'text-light', btnClass: 'btn-primary' },
  3: { fontSize: 'fs-3', bgClass: 'bg-secondary', textClass: 'text-light', btnClass: 'btn-secondary' },
  4: { fontSize: 'fs-4', bgClass: 'bg-secondary', textClass: 'text-light', btnClass: 'btn-secondary' },
  5: { fontSize: 'fs-5', bgClass: 'bg-body-secondary', textClass: 'text-body', btnClass: 'btn-secondary' },
  6: { fontSize: 'fs-6', bgClass: 'bg-body-tertiary', textClass: 'text-body-secondary', btnClass: 'btn-secondary' }
}

// ________________________________________________________________________________
// COMPUTED PROPERTIES
// ________________________________________________________________________________
const config = computed(() => levelConfig[props.level])

const fontSizeClass = computed(() => config.value.fontSize)

const bgClass = computed(() => {
  if (props.color) {
    return `bg-${props.color}`
  }
  return config.value.bgClass
})

const textClass = computed(() => {
  if (props.color) {
    // When custom color is used, determine text color based on color type
    const darkBgColors = ['primary', 'secondary', 'success', 'danger', 'info', 'dark']
    return darkBgColors.includes(props.color) ? 'text-light' : 'text-dark'
  }
  return config.value.textClass
})

const btnClass = computed(() => {
  if (props.color) {
    return `btn-${props.color}`
  }
  return config.value.btnClass
})

watch(() => props.visible, (visible) => {
  console.log(`visible is: ${visible}`)
  local.visible = visible
})

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  visible: props.visible
})

// ________________________________________________________________________________
// EVENT METHODS
// ________________________________________________________________________________
function titleClick() {
  local.visible = !local.visible
}

</script>


<template>
  <div class="x-section">

    <div class="row no-select" :class="bgClass">
      <div class="col" @click="titleClick">
        <span :class="[fontSizeClass, textClass]" class="title"> {{ props.k }} </span>
      </div>
      <div class="col-auto d-flex align-items-center">
        <slot name="header"></slot>
        <button class="btn is-small ms-2" :class="btnClass" @click="titleClick">
          <span class="icon is-small">
            <i class="fa-solid fa-eye" v-if="local.visible"></i>
            <i class="fa-solid fa-eye-slash" v-else></i>
          </span>
        </button>
      </div>
    </div>

    <div class="mt-2" v-if="local.visible">
      <slot></slot>
    </div>

  </div>
</template>

<style scoped>
.no-select {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  cursor: pointer;
}

.x-section {
  width: 100%; /* Ensures it takes full width */
}

.title:hover {
  text-decoration: underline;
}
</style>
