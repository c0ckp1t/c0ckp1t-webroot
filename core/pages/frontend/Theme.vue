<script setup>
/**
 * Live Bootstrap Theme Editor
 * Apply theme changes to the entire page in real-time with comprehensive component preview
 * 
 * This editor controls:
 * - Semantic colors (primary, secondary, success, danger, warning, info, light, dark)
 * - Background colors for both light and dark modes
 * 
 * Changes persist until page refresh.
 */
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, ref, onMounted, onUnmounted, watch} from 'vue'
import {getLogger} from "Logging"

// !# C0CKP1T_START imports
import {Theme, store as storeTheme, api as apiTheme} from "../../../core/Theme.mjs"
// !# C0CKP1T_END imports

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "src/pages/demo/page-theme.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// !# C0CKP1T_START script

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
// Theme colors are now stored in GlobalStore.themeColors for persistence across navigation
// Only UI-specific local state is kept here
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  
  // UI state for this page only
  copySuccess: false,
  
  // Demo form state
  username: '',
  password: '',
  email: '',
  rememberMe: false,
  fullName: '',
  accountType: 'individual',
  bio: '',
  agreedToTerms: false,
  
  // Demo component state
  selectedTab: 'home',
  sidebarActive: 'home',
  searchQuery: ''
})

// ________________________________________________________________________________
// HELPER FUNCTIONS
// ________________________________________________________________________________
// All theme-related helper functions are now in Theme.mjs
// and called via api methods in GlobalStore.mjs

// ________________________________________________________________________________
// METHODS
// ________________________________________________________________________________

/**
 * Load preset theme - delegates to GlobalStore API
 */
function loadPreset(presetName) {
  logger.info(`[loadPreset] - Load ${presetName} theme`)
  apiTheme.loadThemePreset(presetName)
}

/**
 * Reset colors to defaults - delegates to GlobalStore API
 */
function resetColors() {
  logger.info('[resetColors] - Reset to default theme')
  apiTheme.resetThemeColors()
}

/**
 * Copy CSS to clipboard
 */
async function copyCSS() {
  try {
    await navigator.clipboard.writeText(storeTheme.themeColors.generatedCSS)
    local.copySuccess = true
    setTimeout(() => {
      local.copySuccess = false
    }, 2000)
    logger.info('[copyCSS] - CSS copied to clipboard')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

/**
 * Download CSS file
 */
function downloadCSS() {
  const blob = new Blob([storeTheme.themeColors.generatedCSS], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'bootstrap-theme-vars.css'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  logger.info('[downloadCSS] - CSS file downloaded')
}

// ________________________________________________________________________________
// BOOTSWATCH FUNCTIONS
// ________________________________________________________________________________
/**
 * Restore custom editor mode (CSS variable overrides)
 * Reverses the CSS swap and re-enables the theme editor
 */
function restoreCustomEditor() {
  logger.info('[restoreCustomEditor] - Restoring custom editor mode')
  apiTheme.restoreCustomEditor()
}

/**
 * Load a Bootswatch color preset (uses extracted colors with CSS variable system)
 * This allows further customization after loading
 */
function loadBootswatchPreset(themeName) {
  logger.info(`[loadBootswatchPreset] - Loading Bootswatch preset: ${themeName}`)
  apiTheme.loadBootswatchPreset(themeName)
}

/**
 * Demo form handlers
 */
async function handleLogin() {
  await new Promise(r => setTimeout(r, 1000))
  logger.debug(`[handleLogin] - ${local.username}`)
}

async function handleRegister() {
  await new Promise(r => setTimeout(r, 1000))
  logger.debug(`[handleRegister] - ${local.fullName}`)
}

// ________________________________________________________________________________
// WATCHERS
// ________________________________________________________________________________

// Watch semantic colors in GlobalStore
watch(() => ({...storeTheme.themeColors.colors}), () => {
  logger.info("[WATCHER] - Applying new semantic colors")
  apiTheme.applyThemeColors()
}, { deep: true })

// Watch light background colors in GlobalStore
watch(() => ({...storeTheme.themeColors.lightBg}), () => {
  logger.info("[WATCHER] - Applying new light mode backgrounds")
  apiTheme.applyThemeColors()
}, { deep: true })

// Watch dark background colors in GlobalStore
watch(() => ({...storeTheme.themeColors.darkBg}), () => {
  logger.info("[WATCHER] - Applying new dark mode backgrounds")
  apiTheme.applyThemeColors()
}, { deep: true })

// !# C0CKP1T_END script

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  // !# C0CKP1T_START init
  // Initialize theme editor on first visit - reads CSS values and applies theme CSS
  // This is only done once; subsequent visits will skip initialization
  apiTheme.initializeThemeEditor()

  // Build sidebar TOC with custom presets and Bootswatch presets
  const tocItems = [
    // Custom presets
    { name: 'default' , callback: () => loadPreset('default') },
    { name: 'ocean' , callback: () => loadPreset('ocean') },
    { name: 'sunset' , callback: () => loadPreset('sunset') },
    { name: 'forest' , callback: () => loadPreset('forest') },
    { name: 'purple' , callback: () => loadPreset('purple') },
    { name: 'monochrome' , callback: () => loadPreset('monochrome') },
    // Divider for Bootswatch
    { name: '── Bootswatch ──', callback: null, isDivider: true },
  ]
  
  // Add all Bootswatch presets (color-only, allows further customization)
  for (const themeName of Theme.bootswatchThemes) {
    tocItems.push({
      name: themeName.charAt(0).toUpperCase() + themeName.slice(1),
      callback: () => loadBootswatchPreset(themeName)
    })
  }
  
  // storeSidebar.toc = tocItems

  // !# C0CKP1T_END init
}

onMounted(async () => {
  // init()
})

// NOTE: We do NOT remove the style element on unmount so theme persists
// User can refresh the page to reset to defaults
</script>

<template>
  <!--  !# C0CKP1T_START template -->
  <div class="theme-editor-page">
    
    <x-section :level="2" :visible="true" k="Live Theme Editor">

      <!-- ========== BOOTSWATCH CSS SWAP ========== -->
      <div class="bootswatch-section mb-4">
        <h4 class="text-muted mb-3">
          <i class="fa-solid fa-swatchbook me-2"></i>Bootswatch Themes (CSS Swap)
        </h4>
        <p class="text-body-secondary small mb-3">
          Load a complete Bootswatch theme. This replaces the Bootstrap CSS entirely for 100% accurate rendering.
          <span v-if="storeTheme.themeColors.isBootswatchMode" class="text-warning ms-2">
            <i class="fa-solid fa-circle-exclamation me-1"></i>Color editors disabled in CSS swap mode.
          </span>
        </p>
        <div class="d-flex align-items-center gap-3 flex-wrap">

          <x-dropdown2
              v-model="storeTheme.themeColors.currentBootswatchTheme"
              :items="Theme.bootswatchThemes.map( t => ({k: `${ t.charAt(0).toUpperCase() + t.slice(1) }${ Theme.darkByDefaultThemes.includes(t) ? ' (dark)' : '' }`, v: t}))"
              :on-change=" (value) => value ?  apiTheme.loadBootswatchTheme(value) : restoreCustomEditor()"
              default-label="Bootstrap Default"
              group-label="Bootwatch Themes"
              k=""
          />

          <!-- Light/Dark Mode Toggle for Bootswatch -->
          <div  class="btn-group" role="group">
            <button 
              type="button"
              class="btn btn-sm"
              :class="storeTheme.theme === 'light' ? 'btn-warning' : 'btn-outline-secondary'"
              @click="storeTheme.theme = 'light'"
              title="Light Mode"
            >
              <i class="fa-solid fa-sun"></i>
            </button>
            <button 
              type="button"
              class="btn btn-sm"
              :class="storeTheme.theme === 'dark' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="storeTheme.theme = 'dark'"
              title="Dark Mode"
            >
              <i class="fa-solid fa-moon"></i>
            </button>
          </div>
          
          <button 
            v-if="storeTheme.themeColors.isBootswatchMode" 
            class="btn btn-outline-warning btn-sm"
            @click="restoreCustomEditor"
          >
            <i class="fa-solid fa-arrow-rotate-left me-1"></i>Return to Custom Editor
          </button>
        </div>
        
        <!-- Current theme info -->
        <div v-if="storeTheme.themeColors.isBootswatchMode" class="mt-2">
          <small class="text-body-secondary">
            <i class="fa-solid fa-info-circle me-1"></i>
            Active: <strong>{{ storeTheme.themeColors.currentBootswatchTheme.charAt(0).toUpperCase() + storeTheme.themeColors.currentBootswatchTheme.slice(1) }}</strong>
            <span v-if="Theme.darkByDefaultThemes.includes(storeTheme.themeColors.currentBootswatchTheme)" class="ms-2 text-warning">
              (This theme is designed for dark mode)
            </span>
            <span class="ms-2">| Mode: <strong>{{ storeTheme.theme }}</strong></span>
          </small>
        </div>
      </div>

      <!-- ========== SEMANTIC COLORS ========== -->
      <div class="color-section mb-4" :class="{ 'disabled-section': storeTheme.themeColors.isBootswatchMode }">
        <h4 class="text-muted mb-3">
          <i class="fa-solid fa-palette me-2"></i>Semantic Colors
        </h4>
        <p class="text-body-secondary small mb-3">These colors apply to buttons, badges, alerts, and other components.</p>
        <div class="color-grid">
          <div
              v-for="(colorLabel, colorName) in Theme.colorLabels"
              :key="colorName" class="color-picker-row"
          >
            <XColor :colorName="colorName" :colorLabel="colorLabel" v-model="storeTheme.themeColors.colors[colorName]" />

          </div>
        </div>
      </div>

      <!-- ========== LIGHT MODE BACKGROUNDS ========== -->
      <div class="color-section mb-4" :class="{ 'disabled-section': storeTheme.themeColors.isBootswatchMode }">
        <h4 class="text-muted mb-3">
          <i class="fa-solid fa-sun me-2"></i>Light Mode Backgrounds
        </h4>
        <p class="text-body-secondary small mb-3">Background and text colors when light mode is active.</p>
        <div class="color-grid">
          <div
              v-for="(bgLabel, bgName) in Theme.lightBgLabels"
              :key="`light-${bgName}`"
              class="color-picker-row"
          >
            <XColor :colorName="bgName" :colorLabel="bgLabel" v-model="storeTheme.themeColors.lightBg[bgName]" />
          </div>
        </div>
      </div>

      <!-- ========== DARK MODE BACKGROUNDS ========== -->
      <div class="color-section mb-4" :class="{ 'disabled-section': storeTheme.themeColors.isBootswatchMode }">
        <h4 class="text-muted mb-3">
          <i class="fa-solid fa-moon me-2"></i>Dark Mode Backgrounds
        </h4>
        <p class="text-body-secondary small mb-3">Background and text colors when dark mode is active.</p>
        <div class="color-grid">
          <div
              v-for="(bgLabel, bgName) in Theme.darkBgLabels"
              :key="`dark-${bgName}`" class="color-picker-row"
          >
            <XColor :colorName="bgName" :colorLabel="bgLabel" v-model="storeTheme.themeColors.darkBg[bgName]" />
          </div>
        </div>
      </div>

      <!-- ========== ACTION BUTTONS ========== -->
      <div class="action-section mb-4">
        <h4 class="text-muted mb-3">
          <i class="fa-solid fa-gears me-2"></i>Actions
        </h4>
        <div class="action-buttons">
          <ExecButton class="btn btn-outline-secondary" icon="fa-rotate-left me-1" :callback="resetColors">
            Reset to Default
          </ExecButton>
          <ExecButton class="btn btn-outline-primary" icon="fa-copy me-1" :callback="copyCSS">
            {{ local.copySuccess ? 'Copied!' : 'Copy CSS' }}
          </ExecButton>
          <ExecButton class="btn btn-outline-success" icon="fa-download me-1" :callback="downloadCSS">
            Download CSS
          </ExecButton>
        </div>
      </div>

      <!-- ========== CSS OUTPUT ========== -->
      <div  class="css-output-section mb-4">
        <h4 class="text-muted mb-3">
          <i class="fa-solid fa-file-code me-2"></i>Generated CSS
        </h4>
        <textarea
            readonly
            :value="storeTheme.themeColors.generatedCSS"
            class="css-output-textarea form-control"
            rows="20"
        ></textarea>
      </div>

    </x-section>


  </div>
  <!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */

.theme-editor-page {
  padding-bottom: 3rem;
}

/* ========== BOOTSWATCH SECTION ========== */
.bootswatch-section {
  background: var(--bs-tertiary-bg);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
}

/* ========== COLOR SECTION ========== */
.color-section {
  background: var(--bs-tertiary-bg);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.color-picker-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--bs-body-bg);
  border-radius: 6px;
  border: 1px solid var(--bs-border-color);
}


/* ========== DISABLED SECTION (Bootswatch mode) ========== */
.disabled-section {
  opacity: 0.5;
  pointer-events: none;
}

/* ========== ACTION SECTION ========== */
.action-section {
  background: var(--bs-tertiary-bg);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* ========== CSS OUTPUT SECTION ========== */
.css-output-section {
  background: var(--bs-tertiary-bg);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
}

.css-output-textarea {
  font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  background-color: #1e1e1e;
  color: #7ee787;
  border: 1px solid #444;
  padding: 1rem;
  resize: vertical;
  min-height: 400px;
}


/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {

  .color-grid {
    grid-template-columns: 1fr;
  }
}

/* !# C0CKP1T_END style */
</style>
