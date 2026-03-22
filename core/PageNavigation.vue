<script setup>
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, ref, onMounted, onUnmounted, watch, computed, onErrorCaptured} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";

import {api as apiTheme, store as storeTheme} from "./Theme.mjs"

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
  items: [ ],
  navCloseLogo: storeMain.config?.navCloseLogo ?? "./img/logo_v1.svg",
  navOpenLogo: storeMain.config?.navOpenLogo ?? "./img/logo_v2.svg",
  navHasSearch: storeMain.config?.navHasSearch ?? true,
  navHasThemeSel: storeMain.config?.navHasThemeSel ?? true,
})

const navbarClass = computed(() => ({
  'bg-body-tertiary': storeMain.showTopNavBar,
  'border-bottom': storeMain.showTopNavBar,
}))

</script>


<template>
    <nav :class="navbarClass" class="navbar navbar-expand-lg fixed-top">
      <div class="container">

        <a class="navbar-brand" @click.prevent="apiMain.selectLogo()">
          <span   class="nav-select">
            <span  class="me-2 text-warning" v-if="storeMain.showSidebar"><<</span>
            <img :src="local.navCloseLogo" alt="Logo" height="24" class="d-inline-block align-text-top" v-if="!storeMain.showSidebar && local.navCloseLogo">
            <img :src="local.navOpenLogo" alt="Logo" height="24" class="d-inline-block align-text-top" v-if="storeMain.showSidebar && local.navOpenLogo">
          </span>
          <span class="text-warning fw-bold ms-2">{{ storeMain.name }}</span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
                aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav flex-grow-1 justify-content-center">
            <li class="nav-item" v-for="item in local.items" :key="item.path">
              <RouterLink :to="item.path" class="nav-link">
                {{ item.name }}
              </RouterLink>
            </li>
          </ul>

          <form class="d-flex">
            <input v-if="local.navHasSearch" class="form-control me-2" type="search" placeholder="Search" v-model="local.searchQuery">
            <button v-if="local.navHasSearch" class="btn btn-outline-secondary" type="submit">
              <i class="fa-solid fa-search"></i>
            </button>
            <button v-if="local.navHasThemeSel" class="btn btn-outline-secondary me-2" type="button" @click="storeTheme.theme = storeTheme.theme === 'dark' ? 'light' : 'dark'" title="Toggle theme">
              <i class="fa-solid" :class="storeTheme.theme === 'dark' ? 'fa-sun' : 'fa-moon'"></i>
            </button>
          </form>
        </div>
      </div>
    </nav>
</template>

<style>
/* !# C0CKP1T_START style */
.navbar-brand:hover {
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

/* !# C0CKP1T_END style */
</style>
