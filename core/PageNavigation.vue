<script setup>
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, ref, onMounted, onUnmounted, watch, computed, onErrorCaptured} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

import {api as apiTheme, store as storeTheme} from "./Theme.mjs"
import LogoAnimated from "./LogoAnimated.vue"

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'PageNavigation.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// LOCAL
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
})
const navbarExpandClass = computed(() => {
  return storeMain.config?.navAutoCollapse === false ? 'navbar-expand' : 'navbar-expand-lg'
})
const navbarClass = computed(() => ({
  'bg-body-tertiary': storeMain.config?.showTopNavBar ?? true,
  'border-bottom': storeMain.config?.showTopNavBar ?? true,
}))

</script>


<template>
    <nav :class="[navbarClass, navbarExpandClass]" class="navbar fixed-top">
      <div class="container">

        <a class="navbar-brand" @click.prevent="apiMain.selectLogo()">
          <span   class="nav-select">
            <LogoAnimated :isOpen="storeMain.showSidebar" />
          </span>
          <span class="text-warning fw-bold ms-2">{{ storeMain.appName }}</span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
                aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav flex-grow-1 justify-content-center">
            <li class="nav-item" v-for="item in storeMain.config.navItems" :key="item.path">
              <RouterLink :to="item.path" class="nav-link" active-class="active" exact-active-class="active" aria-current="page">
                {{ item.name }}
              </RouterLink>
            </li>
          </ul>

          <form class="d-flex">
            <input v-if="storeMain.config?.navHasSearch ?? true" class="form-control me-2" type="search" placeholder="Search" v-model="local.searchQuery">
            <button v-if="storeMain.config?.navHasSearch ?? true" class="btn btn-outline-secondary" type="submit">
              <i class="fa-solid fa-search"></i>
            </button>
            <button v-if="storeMain.config?.navHasThemeSel ?? true" class="btn btn-outline-secondary me-2" type="button" @click="storeTheme.theme = storeTheme.theme === 'dark' ? 'light' : 'dark'" title="Toggle theme">
              <i class="fa-solid" :class="storeTheme.theme === 'dark' ? 'fa-sun' : 'fa-moon'"></i>
            </button>
          </form>

          <ExecButton  :class="storeMain.OffCanvasClass" icon="fa-bell me-1" :callback="() => apiMain.toggleOffCanvas()">{{storeMain.offCanvasText}}</ExecButton>
        </div>
      </div>
    </nav>
</template>

<style>
/* !# C0CKP1T_START style */
.navbar-brand:hover {
  cursor: pointer;
  border-radius: 4px;
  transform: scale(1.05);
}

/* Fixed navbar height compensation */
.navbar.fixed-top {
  z-index: 1030;
}

/* Nav item links */
.navbar-nav .nav-link {
  padding: 0.5rem 1rem;
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.1s ease, text-decoration-color 0.2s ease;
  border-radius: 6px;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 0.25rem;
  text-decoration-thickness: 2px;
}

.navbar-nav .nav-link:hover {
  background-color: var(--bs-tertiary-bg);
}

.navbar-nav .nav-link:active {
  transform: scale(0.97);
}

.navbar-nav .nav-link.active {
  font-weight: 600;
  text-decoration-color: currentColor;
}

/* !# C0CKP1T_END style */
</style>
