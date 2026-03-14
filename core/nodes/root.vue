<script setup>
/*
  Vue Component for Root Nodes
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, onMounted, onUnmounted, defineAsyncComponent, watch, onErrorCaptured, computed} from 'vue'
import {store as storeMain, methods } from 'GlobalStore'
import {substrAfterFirstSlash} from "JsUtils";

const Overview = defineAsyncComponent(() => import("../components/overview.vue"))

import {useRouter} from "vue-router";
const router = useRouter()

const instanceId = computed(() => {
  return substrAfterFirstSlash(router.currentRoute.value.fullPath)
})
const registry= computed(() => {
  return storeMain.r[instanceId.value]
})

</script>


<template>
  <x-section extra="fs-4" :visible="true" k="Root Node">

    <div class="row">
      <div class="col">
        <x-label k="instanceId">{{ registry?.instanceId ?? 'Invalid Registry' }}</x-label>
      </div>
      <div class="col">
        <x-label k="accessLevel">{{ registry?.store?.context?.accessLevel ?? 'Unknown' }}</x-label>
      </div>
      <div class="col">
        <x-label k="uniqueId">{{ registry?.store?.context?.uniqueId ?? 'Unknown' }}</x-label>
      </div>
    </div>

    <div v-if="registry?.store?.context?.accessLevel < 1000" class="mt-4 mb-4">
      Overview:
      <Overview></Overview>
    </div>

    </x-section>
</template>

<style scoped>

</style>