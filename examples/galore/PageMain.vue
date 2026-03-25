<script setup>
/**
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, ref, onMounted, onUnmounted, watch, computed, onErrorCaptured} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

import {api as apiTheme, store as storeTheme} from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.19/core/Theme.mjs"
import BootstrapComponents from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.19/core/pages/frontend/Bootstrap.vue"
import BasicComponents from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.19/core/pages/frontend/ComponentsBasic.vue"
import AdvComponents from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.19/core/pages/frontend/ComponentsAdv.vue"
import LogoAnimated from "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.19/core/LogoAnimated.vue";

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'PageMain.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// LOCAL
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  items: [
    {name: "Vue Adv", path: "#components-adv"},
    {name: "Vue Basic", path: "#components"},
    {name: "Bootstrap", path: "#bootstrap"},
  ],
  navCloseLogo: storeMain.config?.navCloseLogo ?? "./img/logo_v1.svg",
})

watch(
    () => storeTheme.theme,
    (newTheme) => {
      document.documentElement.setAttribute('data-bs-theme', newTheme)
    },
    { immediate: true } // Run immediately on load
)

//________________________________________________________________________________
// METHODS
//________________________________________________________________________________
function scrollTo(hash) {
  const el = document.querySelector(hash)
  if (el) {
    const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'))
    window.scrollTo({
      top: el.offsetTop - navbarHeight,
      behavior: 'smooth'
    })
  }
}

function clickLogo() {
  window.location.href = "/"
}

//________________________________________________________________________________
// INIT
//________________________________________________________________________________
onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', storeTheme.theme)
})
</script>


<template>
  <div class="page-main">

    <!-- ==========  NAVIGATION ========== -->
    <nav class="navbar navbar-expand-lg fixed-top bg-body-tertiary border-bottom">
      <div class="container">

        <a class="navbar-brand" @click.prevent="clickLogo()" title="Go to c0ckp1t.com">
          <span   class="nav-select">
            <LogoAnimated  />
          </span>
        </a>

          <ul class="navbar-nav flex-grow-1 justify-content-center">
            <li class="nav-item" v-for="item in local.items" :key="item.path">
              <a :href="item.path" class="nav-link text-primary fw-bold" @click.prevent="scrollTo(item.path)">
                {{ item.name }}
              </a>
            </li>
          </ul>

        <span class="d-flex">
        <button  class="btn btn-outline-secondary me-2" type="button" @click="storeTheme.theme = storeTheme.theme === 'dark' ? 'light' : 'dark'" title="Toggle theme">
          <i class="fa-solid" :class="storeTheme.theme === 'dark' ? 'fa-sun' : 'fa-moon'"></i>
        </button>
        </span>

      </div>
    </nav>

    <!-- ==========  MAIN CONTENT ========== -->
    <main class="container-fluid main-content" >
      <div id="components-adv">
        <AdvComponents/>
      </div>
      <div id="components">
        <BasicComponents/>
      </div>
      <div id="bootstrap">
        <BootstrapComponents/>
      </div>
    </main>



  </div>
</template>

<style>
/* !# C0CKP1T_START style */

:root {
  --navbar-height: 56px;
}


.nav-link:hover {
  color: var(--bs-secondary) !important;
  text-decoration: underline;
}

.page-main{
  /* Ensure text color inherits the bootstrap variable */
  color: var(--bs-body-color);
  background-color: var(--bs-body-bg); /* Explicitly set background to match body */
  min-height: 100vh;
}
.nav-select {
  display: inline-block;
  padding-left: 8px;
}
.nav-select:hover {
  cursor: pointer;
  background-color: rgba(var(--bs-warning-rgb), 0.1);
  border-radius: 4px;
  transform: scale(1.05);
  transition: background-color 0.2s ease;
}

/* Fixed navbar height compensation */
.navbar.fixed-top {
  z-index: 1030;
}

.main-content {
  min-height: 100vh;
  padding-top: var(--navbar-height); /* Space for the fixed navbar */
}

#bootstrap, #components, #components-adv {
  scroll-margin-top: var(--navbar-height);
}
/* !# C0CKP1T_END style */
</style>
