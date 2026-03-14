<script setup>
/*
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, onMounted, onUnmounted, defineAsyncComponent, watch, onErrorCaptured, computed} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'

const InfoApi = defineAsyncComponent(() => import("./_api.vue"))

const selectedNode = computed(() => {
  return storeMain.r[storeMain.selectedInstId]?.store?.selectedNode
})

</script>


<template>
  <div class="place-holder">
    <x-section :level="3" :visible="true" :k="`Place Holder Node (endpoint=${selectedNode.endpoint})`" v-if="selectedNode">

      <x-section :level="4" :visible="true" :k="`Node Information`">
        <div class="row mt-4 mb-4">
          <x-collapse k="Node Entity" :modelValue="true">
            <x-json :obj="selectedNode"  :expanded="true"></x-json>
          </x-collapse>
        </div>
      </x-section>

    </x-section>
  </div>
</template>

<style scoped>


</style>