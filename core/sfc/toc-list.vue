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
  <ul :class="['toc-list', `toc-level-${level}`]">
    <li v-for="item in items" :key="item.anchor" class="toc-item">
      <a 
        :href="`#${item.anchor}`" 
        @click.prevent="emit('scroll-to', item.anchor)"
        class="toc-link"
        :title="`Jump to: ${item.fullText}`"
      >
        {{ item.text }}
      </a>
      <!-- Recursive: render children if they exist -->
      <TocList 
        v-if="item.children && item.children.length > 0"
        :items="item.children"
        :level="level + 1"
        @scroll-to="emit('scroll-to', $event)"
      />
    </li>
  </ul>
</template>

<style scoped>
/* ============================================================================
   TOC Lists - Base Styles
   ============================================================================ */
.toc-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

/* Indent nested levels */
.toc-level-1,
.toc-level-2,
.toc-level-3,
.toc-level-4,
.toc-level-5 {
  padding-left: 1rem;
}

/* ============================================================================
   TOC Items
   ============================================================================ */
.toc-item {
  margin: 0.25rem 0;
}

/* Level-specific font styling */
.toc-level-0 > .toc-item {
  font-weight: 600;  /* Bold for top-level (H1/H2) */
  font-size: 0.9rem;
}

.toc-level-1 > .toc-item {
  font-weight: 500;
  font-size: 0.85rem;
}

.toc-level-2 > .toc-item {
  font-weight: 400;
  font-size: 0.8rem;
}

.toc-level-3 > .toc-item,
.toc-level-4 > .toc-item,
.toc-level-5 > .toc-item {
  font-weight: 400;
  font-size: 0.75rem;
  opacity: 0.9;
}

/* ============================================================================
   TOC Links
   ============================================================================ */
.toc-link {
  color: var(--bs-body-color);  /* Default text color */
  text-decoration: none;
  display: block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
}

.toc-link:hover {
  background-color: rgba(130, 177, 255, 0.1);  /* Subtle blue highlight */
  color: var(--color6);  /* Blue text on hover */
  padding-left: 0.75rem;  /* Slide in effect */
  transform: translateX(2px);
}

.toc-link:active {
  background-color: rgba(130, 177, 255, 0.2);
}

/* ============================================================================
   Level Markers - Visual Hierarchy
   ============================================================================ */
/* Level 0 (H1/H2) - Triangle marker in gold */
.toc-level-0 > .toc-item > .toc-link::before {
  content: "▸ ";
  color: var(--color5);  /* Gold */
  font-weight: bold;
  margin-right: 0.25rem;
}

/* Level 1 (H3) - Bullet marker in blue */
.toc-level-1 > .toc-item > .toc-link::before {
  content: "• ";
  color: var(--color6);  /* Blue */
  margin-right: 0.25rem;
}

/* Level 2 (H4) - Small triangle in gray */
.toc-level-2 > .toc-item > .toc-link::before {
  content: "‣ ";
  color: var(--color3);  /* Gray */
  margin-right: 0.25rem;
}

/* Level 3+ (H5+) - Dash marker */
.toc-level-3 > .toc-item > .toc-link::before,
.toc-level-4 > .toc-item > .toc-link::before,
.toc-level-5 > .toc-item > .toc-link::before {
  content: "− ";
  color: var(--color3);  /* Gray */
  margin-right: 0.25rem;
  opacity: 0.7;
}

/* ============================================================================
   Responsive Design
   ============================================================================ */
@media (max-width: 768px) {
  .toc-level-0 > .toc-item {
    font-size: 0.85rem;
  }

  .toc-level-1 > .toc-item {
    font-size: 0.8rem;
  }

  .toc-level-2 > .toc-item,
  .toc-level-3 > .toc-item {
    font-size: 0.75rem;
  }
  
  /* Reduce indentation on mobile */
  .toc-level-1,
  .toc-level-2,
  .toc-level-3 {
    padding-left: 0.75rem;
  }
}
</style>
