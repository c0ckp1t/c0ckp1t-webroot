<script setup>
/**
 * Recursive TOC List Component
 * Renders a hierarchical list of table of contents items
 */
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['scroll-to'])
</script>

<template>

</template>

<style scoped>
</style>
