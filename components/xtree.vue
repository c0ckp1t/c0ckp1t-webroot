<script setup>
/*
    Usage:
      <x-tree :items="treeData" @select="onSelect"></x-tree>

      // treeData is an Array of Node objects:
      Node {
        label: String,           // Display text
        path: String,            // Unique identifier/path
        isDirectory: Boolean,    // true = folder icon, false = file icon
        expanded: Boolean,       // Initial expanded state (directories only)
        children: Array<Node>,   // Child nodes (empty array [] for files/empty folders)
      }

      // Example:
      const treeData = [
        {
          label: "src",
          path: "/src",
          isDirectory: true,
          expanded: true,
          children: [
            { label: "App.vue", path: "/src/App.vue", isDirectory: false, expanded: false, children: [] }
          ]
        }
      ]

      function onSelect(item) {
        console.log("Selected:", item.path)
      }
 */
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import { reactive, onMounted } from 'vue'

// ________________________________________________________________________________
// PROPERTIES & EMITS
// ________________________________________________________________________________
const props = defineProps({
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['select'])

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  expandedItems: []
})

// ________________________________________________________________________________
// EVENTS
// ________________________________________________________________________________
function toggle(item) {
  if (item.children) {
    item.expanded = !item.expanded
    select(item)
    if (item.expanded) {
      local.expandedItems.push(item)
    } else {
      local.expandedItems.splice(local.expandedItems.indexOf(item), 1)
    }
  }
}

function select(item) {
  // console.log(item)
  emit('select', item)
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
onMounted(async () => {
  if (props.items?.length) {
    local.expandedItems = props.items.filter(item => item.expanded)
  }
})

</script>

<template>
  <div class="x-tree">
    <div v-if="!items || items.length === 0" class="text-muted ps-2">
      No Items
    </div>
    <ul v-else>
      <li v-for="item in items" :key="item.path">
        <div class="d-flex align-items-center">
          <i class="fa-solid me-1" :class="{
            'fa-folder': item.isDirectory && !item.expanded,
            'fa-folder-open': item.isDirectory && item.expanded,
            'fa-file': !item.isDirectory
          }"></i>
          <span class="folder" @click="toggle(item)" v-if="item.children?.length > 0">{{ item.label }}</span>
          <span class="item" @click="select(item)" v-if="!item.children?.length">{{ item.label }}</span>
        </div>
        <x-tree @select="select" v-if="item.children?.length" :items="item.children" v-show="item.expanded"></x-tree>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.x-tree ul {
  list-style: none;
  padding-left: 1.2rem;
  margin: 0;
}

.item {
  min-width: 100px;
}

.item:hover {
  cursor: pointer;
  color: var(--bs-primary);
  background-color: var(--bs-light);
}

.folder {
  min-width: 100px;
}

.fa-folder {
  color: #FFDB58;
}

.fa-folder-open {
  color: #D2691E;
}

.folder:hover {
  cursor: pointer;
  color: var(--bs-primary);
  background-color: var(--bs-light);
}
</style>
