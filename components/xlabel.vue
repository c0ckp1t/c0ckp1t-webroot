<script setup>
/*
<x-label k="k">my label value template</x-label>
<x-label k="k" :isCompact="true">my label value template</x-label>
<x-label k="k">https://example.com</x-label>
*/
import {computed, useSlots} from 'vue'

const props = defineProps({
  k: {
    type: String,
    default: () => "Default Title"
  },
  isCompact: {
    type: Boolean,
    default: false
  }
})

const slots = useSlots()
const slotText = computed(() => {
  const defaultSlot = slots.default?.()
  if (defaultSlot && defaultSlot.length > 0) {
    const firstChild = defaultSlot[0]
    if (typeof firstChild.children === 'string') {
      return firstChild.children.trim()
    }
  }
  return ''
})

const isLink = computed(() => {
  return slotText.value.includes("http://") || slotText.value.includes("https://")
})

</script>


<template >
<div class="input-group x-label">
  <span class="label input-group-text" :class="{  'compact': props.isCompact }" v-if="k !== null">{{ k }}</span>
  <span class="input-group-text">
    <a v-if="isLink" :href="slotText" target="_blank" rel="noopener noreferrer">{{ slotText }}</a>
    <slot v-else></slot>
  </span>
</div>
</template>

<style scoped>
.label {
  font-weight: bold;
}
.label:not(.compact) {
  min-width: 150px;
}
</style>
