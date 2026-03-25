<script setup>
/**
 * C0ckp1t Webroot Minimum Example
 */
import {reactive, ref, onMounted} from 'vue'
import LogoAnimated from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.19/core/LogoAnimated.vue";

const local = reactive({
  id: "PageMain.vue",
  isOpen: true,
  text: "Minimum Example"
})
function goToRoot() {
  window.location.href = '/'
}
function onEnter() {
  local.isOpen = false
  local.text = "Vist C0ckp1t Homepage"
}
function onLeave() {
  local.isOpen = true
  local.text = "Minimum Example"
}
</script>

<template>
  <section class="page-main " >
      <LogoAnimated class="logo-large" @click.prevent="goToRoot"
          :isOpen="local.isOpen" @mouseenter="onEnter" @mouseleave="onLeave" />
      <h1 class="main-text">{{local.text}}</h1>
  </section>
</template>

<style >
body {
  background-color: black;
  color: white;
}
.page-main {
 min-height: 80vh;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
}
svg {
  height: 128px !important;
  width: auto !important;
  margin: 10px;
}
</style>
