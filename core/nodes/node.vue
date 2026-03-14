<script setup>
/*
  Usage: 
    const node = defineAsyncComponent(() => import("/v2/reg/node.vue"))
    <node :v="storeMain.r[props.id].store.root"></node>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, onMounted, onUnmounted, defineAsyncComponent} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

// must use defineAsyncComponent for recursive component
const node = defineAsyncComponent(() => import("./node.vue"))

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'node.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

const props = defineProps({
  v: Object,
  id: String
})

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  root: {},
  icons: {
    'CCR_SERVICE': "fa-list",
    'STORAGE_NAMESPACE': "fa-database",
    'LOGGER': "fa-scroll",
    'API': "fa-plug",
    'WORKFLOW': 'fa-computer' // '
  }
})

const name = computed(() => {
  if (props.v?.children?.length > 0) {
    return `${props.v.name}/`
  } else {
    return `${props.v.name}`
  }
})

const endpoint = computed(() => {
  return storeMain.r[props.id]?.store?.selectedNode?.endpoint
})

const isParent = computed(() => {
  return props.v?.children?.length > 0
})

const icon = computed(() => {
  if (props.v.type in local.icons) {
    return local.icons[props.v.type]
  } else if (isParent.value && !props.v._expanded) {
    return 'fa-folder'
  } else if (isParent.value && props.v._expanded) {
    return 'fa-folder-open'
  } else if (!isParent.value) {
    return 'fa-file'
  } else {
    'fa-bug'
  }
})

// ________________________________________________________________________________
// EVENTS
// ________________________________________________________________________________
async function toggle() {
  if (isParent.value) {
    props.v._expanded = !props.v._expanded
  }
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (storeMain.connected) {
  } else {
    setTimeout(async () => {
      await init()
    }, 1000)
  }
}

onMounted(async () => {
  init()
})


</script>


<template>
  <li v-if="storeMain.r[props.id].store">
    <div class="content" :style="{ '--level': props.v.depth }">
      <i class="fa-solid me-1" :class="icon" @click="toggle"></i>
      <span :class="{'name': endpoint === props.v.endpoint}" class="folder" @click="storeMain.r[props.id].selectNode(props.v)" v-if="isParent">{{ name }} </span>
      <span :class="{'name': endpoint === props.v.endpoint}" class="item" @click="storeMain.r[props.id].selectNode(props.v)" v-else>{{ name }}</span>
    </div>
    <ul  v-show="isParent && props.v._expanded">
      <node v-for="child in props.v.children" :v="child" :key="child.endpoint" :id="props.id"></node>
    </ul>
  </li>
</template>

<style scoped>
.content {
  --level: 1;
}
/* Remove default list styles and set relative positioning */
ul {
  list-style-type: none;
  margin: 0;
  padding-left: 1em; /* Indentation for nested lists */
  padding-top: 0.0em;
  position: relative;
}

/* Draw the vertical line for the list */
ul::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0.5em; /* Align with the indentation */
  bottom: 0;
  width: 0;
  border-left: 1px solid var(--bs-border-color); /* Vertical line */
}

/* Position list items relative to parent */
li {
  position: relative;
  margin: 0;
  /* top | left and right | bottom */
  padding: 0.1em 0 0 0.1em;
}

/* Draw the horizontal connector line */
li::before {
  content: "";
  position: absolute;
  top: 1em; /* Position vertically centered with the text */
  left: -0.5em; /* Align with the vertical line */
  width: 0.5em; /* Length of the horizontal line */
  height: 0;
  border-top: 1px solid var(--bs-border-color); /* Horizontal line */
}

/* Remove vertical line after the last child */
li:last-child > ul::before {
  //display: none;
}

/* Remove horizontal line from the root node */
ul:not(:first-of-type)::before {
  top: 0;
}

/* Remove horizontal line from last child */
li:last-child::before {
  background: var(--bs-body-bg);
}

/* Styling for selected node */
.name {
  color: var(--bs-primary);
  font-weight: 600;
  background-color: var(--bs-primary-bg-subtle);
  border-radius: var(--bs-border-radius-sm);
}

/* Common styles for items and folders */
.item,
.folder {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: var(--bs-border-radius-sm);
  transition: all 0.15s ease-in-out;
  //border: 1px solid black;
  //min-width: calc(var(--level) * 20px);
}

/* Hover effects */
.item:hover,
.folder:hover {
  cursor: pointer;
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
}

/* Specific hover colors */
.item:hover {
  color: var(--bs-primary);
}


/* Icons colors */
.fa-folder {
  color: var(--bs-warning);
  transition: transform 0.15s ease-in-out, color 0.15s ease-in-out;
}

.fa-folder-open {
  color: var(--bs-orange);
  transition: transform 0.15s ease-in-out, color 0.15s ease-in-out;
}

.fa-file {
  color: var(--bs-secondary);
  transition: transform 0.15s ease-in-out, color 0.15s ease-in-out;
}

/* Icon hover effects */
i.fa-solid {
  cursor: pointer;
}

i.fa-solid:hover {
  transform: scale(1.15);
}

.folder:hover {
  cursor: pointer;
  color: var(--bs-primary);
  background-color: var(--bs-primary-bg-subtle);
}

/* Focus states for accessibility */
.item:focus-visible,
.folder:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

</style>
