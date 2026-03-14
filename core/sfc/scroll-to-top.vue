<script setup>
import {onBeforeUnmount, onMounted} from "vue";
import {api as apiMain} from "GlobalStore";

onMounted(() => {
  apiMain.init()
  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
})


onBeforeUnmount(() => {
  // Clean up scroll listener
  window.removeEventListener('scroll', handleScroll)
})
// ________________________________________________________________________________
// SCROLL TO TOP
// ________________________________________________________________________________
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleScroll() {
  // Show button when user scrolls down 300px
  local.showScrollToTop = window.scrollY > 300
}
</script>

<template>
  <!-- Scroll to Top Button -->
  <button
      v-if="local.showScrollToTop"
      @click="scrollToTop"
      class="scroll-to-top-btn"
      title="Scroll to top"
  > ↑ </button>
</template>

<style scoped>
.scroll-to-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;
}

.scroll-to-top-btn:hover {
  background-color: #0b5ed7;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.scroll-to-top-btn:active {
  transform: translateY(-1px);
}
</style>
