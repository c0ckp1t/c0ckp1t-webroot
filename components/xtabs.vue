<script setup>
/*
      <x-tabs>

        <template #header>
          <h1>Header</h1>
        </template>

        <template #footer>
          <h4>Footer</h4>
        </template>

      </x-tabs>
 */
import {ref, getCurrentInstance, computed} from 'vue'

const activeTab = ref(0)
const instance = getCurrentInstance()
// Automatically gather slot names and titles
const tabs = computed(() => {
  if (!instance?.slots) return []
  return Object.entries(instance.slots)
      .filter(([slotName]) => slotName !== 'default') // Ignore default slot (i.e only consider named slots)
      .map(([name, slotFn]) => {
        const vnodes = slotFn() // Render the slot to get children VNodes
        const firstVNode = vnodes.find(vn => typeof vn.type !== 'symbol') // Ignore text/comments
        // Extract title if present in the first element
        const title = firstVNode?.props?.title || name
        return { name, title }
      })
})
</script>

<template>
  <div class="x-tabs">

    <ul class="nav nav-tabs" role="tablist">
      <li v-for="(tab, index) in tabs" :key="tab.name" class="nav-item" role="presentation">
        <a
            class="nav-link"
            :class="{ active: activeTab === index }"
            :href="`#${tab.name}`"
            data-bs-toggle="tab"
            :aria-selected="activeTab === index"
            :tabindex="activeTab === index ? undefined : -1"
            role="tab"
            @click.prevent="activeTab = index"
        >
          {{ tab.title }}
        </a>
      </li>
    </ul>

    <div class="tab-content p-3 border-top-0 border">
      <div
          v-for="(tab, index) in tabs"
          :key="tab.name"
          :id="tab.name"
          class="tab-pane fade"
          :class="{ 'show active': activeTab === index }"
          role="tabpanel"
      >
        <slot :name="tab.name"></slot>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>
