import {markRaw, reactive, watch, defineAsyncComponent, createApp} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from 'Logging';

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'Theme.mjs'
const logger = getLogger(LOG_HEADER)
logger.info("[INIT]")

// ________________________________________________________________________________
// CONSTANTS
// ________________________________________________________________________________
// Style element ID for dynamic theme injection
const THEME_STYLE_ID = 'c0ckp1t-dynamic-theme'
const BOOTSWATCH_LINK_ID = 'c0ckp1t-bootswatch-theme'
const THEME_VARS_LINK_ID = 'bootstrap-theme-vars'  // ID from index.html
const BOOTSTRAP_MAIN_ID = 'bootstrap-main'  // ID from index.html

// Static fallback colors (Bootstrap 5 defaults)
const fallbackColors = {
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    light: '#f8f9fa',
    dark: '#212529'
}

// Semantic colors (buttons, badges, alerts, etc.)
// Use static fallback initially - actual CSS values are read during initializeDefaultColors()
const defaultColors = {...fallbackColors}

// Static fallback for light mode backgrounds (Bootstrap 5 defaults)
const fallbackLightBg = {
    bodyBg: '#ffffff',
    bodyColor: '#212529',
    secondaryBg: '#e9ecef',
    tertiaryBg: '#f8f9fa',
    borderColor: '#dee2e6',
    emphasisColor: '#000000'
}

// Static fallback for dark mode backgrounds (Bootstrap 5 defaults)
const fallbackDarkBg = {
    bodyBg: '#212529',
    bodyColor: '#dee2e6',
    secondaryBg: '#343a40',
    tertiaryBg: '#2b3035',
    borderColor: '#495057',
    emphasisColor: '#ffffff'
}

// Background colors for light mode - initialized with fallbacks, updated from CSS later
const defaultLightBg = {...fallbackLightBg}

// Background colors for dark mode - initialized with fallbacks, updated from CSS later
const defaultDarkBg = {...fallbackDarkBg}

// Cache for background colors read from CSS
let cachedLightBg = null
let cachedDarkBg = null

// ________________________________________________________________________________
// STORE
// ________________________________________________________________________________
export const store = reactive({
    bootswatchURL: storeMain.config?.bootswatchURL || "https://cdn.jsdelivr.net/npm/bootswatch@5.3.8/dist",
    // ________________________________________________________________________________
    // Theme Colors (for theme editor persistence across navigation)
    // ________________________________________________________________________________
    theme: "dark",
    themeColors: {
        colors: { ...defaultColors },
        lightBg: { ...defaultLightBg },
        darkBg: { ...defaultDarkBg },
        currentBootswatchTheme: null,  // null = custom editor mode, string = Bootswatch CSS active
        isBootswatchMode: false,       // true when using Bootswatch CSS swap
        generatedCSS: '',              // Generated CSS string for display/download
        isInitialized: false,          // true after theme editor has been visited and CSS applied
    },

})


// ________________________________________________________________________________
// API
// ________________________________________________________________________________
export const api = {
    // ________________________________________________________________________________
    // THEME
    // ________________________________________________________________________________
    toggleTheme() {
        store.theme = store.theme === 'dark' ? 'light' : 'dark'
        logger.info(`[toggleTheme] - Theme changed to: ${store.theme}`)
    },

    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            store.theme = theme
            logger.info(`[setTheme] - Theme set to: ${store.theme}`)
        } else {
            logger.warn(`[setTheme] - Invalid theme: ${theme}. Use 'dark' or 'light'.`)
        }
    },

    // ________________________________________________________________________________
    // THEME COLORS (for theme editor)
    // ________________________________________________________________________________

    /**
     * Apply the current theme colors to the DOM
     * @returns {string} - Generated CSS string
     */
    applyThemeColors() {
        const css = Theme.applyThemeToDOM(
            store.themeColors.colors,
            store.themeColors.lightBg,
            store.themeColors.darkBg
        )
        store.themeColors.generatedCSS = css
        logger.info('[applyThemeColors] - Theme applied to DOM')
        return css
    },

    /**
     * Load a preset theme by name
     * @param {string} presetName - Name of the preset (from Theme.presets)
     */
    loadThemePreset(presetName) {
        logger.info(`[loadThemePreset] - Loading preset: ${presetName}`)
        const preset = Theme.presets[presetName]
        if (preset) {
            store.themeColors.colors = { ...preset.colors }
            store.themeColors.lightBg = { ...preset.lightBg }
            store.themeColors.darkBg = { ...preset.darkBg }
            api.applyThemeColors()
        } else {
            logger.error(`[loadThemePreset] - Preset ${presetName} not found`)
        }
    },

    /**
     * Load a Bootswatch color preset (uses CSS variable system)
     * @param {string} themeName - Name of the Bootswatch theme
     */
    loadBootswatchPreset(themeName) {
        logger.info(`[loadBootswatchPreset] - Loading Bootswatch preset: ${themeName}`)

        // If currently in Bootswatch CSS mode, restore custom editor first
        if (store.themeColors.isBootswatchMode) {
            api.restoreCustomEditor()
        }

        const preset = Theme.bootswatchPresets[themeName]
        if (preset) {
            store.themeColors.colors = { ...preset.colors }
            store.themeColors.lightBg = { ...preset.lightBg }
            store.themeColors.darkBg = { ...preset.darkBg }
            api.applyThemeColors()
        } else {
            logger.error(`[loadBootswatchPreset] - Bootswatch preset ${themeName} not found`)
        }
    },

    /**
     * Load a Bootswatch theme via CSS swap (complete Bootstrap CSS replacement)
     * @param {string} themeName - Name of the Bootswatch theme
     */
    loadBootswatchTheme(themeName) {
        logger.info(`[loadBootswatchTheme] - Loading Bootswatch theme: ${themeName}`)
        if(Theme.darkByDefaultThemes.includes(themeName)) {
            api.setTheme('dark')
        } else {
            api.setTheme('light')
        }
        Theme.loadBootswatchTheme(themeName, null)
        store.themeColors.currentBootswatchTheme = themeName
        store.themeColors.isBootswatchMode = true
    },

    /**
     * Restore custom editor mode from Bootswatch CSS swap
     */
    restoreCustomEditor() {
        logger.info('[restoreCustomEditor] - Restoring custom editor mode')
        const css = Theme.restoreCustomEditor(
            store.themeColors.colors,
            store.themeColors.lightBg,
            store.themeColors.darkBg
        )
        store.themeColors.generatedCSS = css
        store.themeColors.currentBootswatchTheme = null
        store.themeColors.isBootswatchMode = false
    },

    /**
     * Reset theme colors to defaults
     * Only applies CSS if theme has been initialized (editor has been visited)
     */
    resetThemeColors() {
        store.themeColors.colors = { ...Theme.defaultColors }
        store.themeColors.lightBg = { ...Theme.defaultLightBg }
        store.themeColors.darkBg = { ...Theme.defaultDarkBg }
        logger.info('[resetThemeColors] - Reset to default theme')
        // Only apply CSS if theme has been initialized
        if (store.themeColors.isInitialized) {
            api.applyThemeColors()
        }
    },

    /**
     * Initialize the theme editor - reads actual CSS values and applies theme CSS
     * Should be called once when the theme editor page is first visited
     */
    initializeThemeEditor() {
        if (store.themeColors.isInitialized) {
            logger.debug('[initializeThemeEditor] - Already initialized, skipping')
            return
        }

        logger.info('[initializeThemeEditor] - Initializing theme editor')

        // Read actual CSS values from the DOM (now that DOM is ready)
        // This returns { colors, lightBg, darkBg } with values read from CSS
        const { colors, lightBg, darkBg } = Theme.initializeDefaultColors()

        // Update store with actual default values read from CSS
        store.themeColors.colors = { ...colors }
        store.themeColors.lightBg = { ...lightBg }
        store.themeColors.darkBg = { ...darkBg }

        // Apply theme CSS to DOM
        api.applyThemeColors()

        // Mark as initialized
        store.themeColors.isInitialized = true
    },

    /**
     * Update a specific semantic color
     * @param {string} colorName - Name of the color (primary, secondary, etc.)
     * @param {string} value - Hex color value
     */
    setThemeColor(colorName, value) {
        if (store.themeColors.colors.hasOwnProperty(colorName)) {
            store.themeColors.colors[colorName] = value
            api.applyThemeColors()
        }
    },

    /**
     * Update a light mode background color
     * @param {string} bgName - Name of the background (bodyBg, bodyColor, etc.)
     * @param {string} value - Hex color value
     */
    setLightBg(bgName, value) {
        if (store.themeColors.lightBg.hasOwnProperty(bgName)) {
            store.themeColors.lightBg[bgName] = value
            api.applyThemeColors()
        }
    },

    /**
     * Update a dark mode background color
     * @param {string} bgName - Name of the background (bodyBg, bodyColor, etc.)
     * @param {string} value - Hex color value
     */
    setDarkBg(bgName, value) {
        if (store.themeColors.darkBg.hasOwnProperty(bgName)) {
            store.themeColors.darkBg[bgName] = value
            api.applyThemeColors()
        }
    },

}



// Cache for initial colors read from CSS
let cachedDefaultColors = null

/**
 * Read a CSS variable value from :root and convert to hex if needed
 * @param {CSSStyleDeclaration} styles - Computed styles from :root
 * @param {string} varName - CSS variable name (without --)
 * @param {string} fallback - Fallback hex value
 * @returns {string} - Hex color value
 */
function readCssColor(styles, varName, fallback) {
    const value = styles.getPropertyValue(`--bs-${varName}`).trim()
    if (!value) return fallback
    
    // If already hex, return as-is
    if (value.startsWith('#')) return value
    
    // If rgb/rgba format, convert to hex
    const rgbMatch = value.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10)
        const g = parseInt(rgbMatch[2], 10)
        const b = parseInt(rgbMatch[3], 10)
        return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
    }
    
    return fallback
}

/**
 * Get default colors - reads from CSS variables on first call, then returns cached values
 * @returns {Object} - Default color values
 */
function getDefaultColors() {
    // Return cached values if already read
    if (cachedDefaultColors) return cachedDefaultColors
    
    // Check if we're in a browser environment with DOM access
    if (typeof document === 'undefined' || !document.documentElement) {
        return {...fallbackColors}
    }
    
    const styles = getComputedStyle(document.documentElement)
    
    cachedDefaultColors = {
        primary: readCssColor(styles, 'primary', fallbackColors.primary),
        secondary: readCssColor(styles, 'secondary', fallbackColors.secondary),
        success: readCssColor(styles, 'success', fallbackColors.success),
        danger: readCssColor(styles, 'danger', fallbackColors.danger),
        warning: readCssColor(styles, 'warning', fallbackColors.warning),
        info: readCssColor(styles, 'info', fallbackColors.info),
        light: readCssColor(styles, 'light', fallbackColors.light),
        dark: readCssColor(styles, 'dark', fallbackColors.dark)
    }
    
    return cachedDefaultColors
}



/**
 * Get light mode background colors - reads from CSS variables on first call
 * @returns {Object} - Light mode background color values
 */
function getLightBgColors() {
    if (cachedLightBg) return cachedLightBg
    
    if (typeof document === 'undefined' || !document.documentElement) {
        return {...fallbackLightBg}
    }
    
    // Temporarily switch to light mode to read light mode CSS variables
    const currentTheme = document.documentElement.getAttribute('data-bs-theme')
    document.documentElement.setAttribute('data-bs-theme', 'light')
    
    // Force a reflow to ensure computed styles are updated
    void document.documentElement.offsetHeight
    
    const styles = getComputedStyle(document.documentElement)
    
    cachedLightBg = {
        bodyBg: readCssColor(styles, 'body-bg', fallbackLightBg.bodyBg),
        bodyColor: readCssColor(styles, 'body-color', fallbackLightBg.bodyColor),
        secondaryBg: readCssColor(styles, 'secondary-bg', fallbackLightBg.secondaryBg),
        tertiaryBg: readCssColor(styles, 'tertiary-bg', fallbackLightBg.tertiaryBg),
        borderColor: readCssColor(styles, 'border-color', fallbackLightBg.borderColor),
        emphasisColor: readCssColor(styles, 'emphasis-color', fallbackLightBg.emphasisColor)
    }
    
    // Restore original theme
    if (currentTheme) {
        document.documentElement.setAttribute('data-bs-theme', currentTheme)
    } else {
        document.documentElement.removeAttribute('data-bs-theme')
    }
    
    return cachedLightBg
}

/**
 * Get dark mode background colors - reads from CSS variables on first call
 * @returns {Object} - Dark mode background color values
 */
function getDarkBgColors() {
    if (cachedDarkBg) return cachedDarkBg
    
    if (typeof document === 'undefined' || !document.documentElement) {
        return {...fallbackDarkBg}
    }
    
    // Temporarily switch to dark mode to read dark mode CSS variables
    const currentTheme = document.documentElement.getAttribute('data-bs-theme')
    document.documentElement.setAttribute('data-bs-theme', 'dark')
    
    // Force a reflow to ensure computed styles are updated
    void document.documentElement.offsetHeight
    
    // Get a fresh computed style object after the reflow
    const styles = window.getComputedStyle(document.documentElement)
    
    cachedDarkBg = {
        bodyBg: readCssColor(styles, 'body-bg', fallbackDarkBg.bodyBg),
        bodyColor: readCssColor(styles, 'body-color', fallbackDarkBg.bodyColor),
        secondaryBg: readCssColor(styles, 'secondary-bg', fallbackDarkBg.secondaryBg),
        tertiaryBg: readCssColor(styles, 'tertiary-bg', fallbackDarkBg.tertiaryBg),
        borderColor: readCssColor(styles, 'border-color', fallbackDarkBg.borderColor),
        emphasisColor: readCssColor(styles, 'emphasis-color', fallbackDarkBg.emphasisColor)
    }
    
    // Restore original theme
    if (currentTheme) {
        document.documentElement.setAttribute('data-bs-theme', currentTheme)
    } else {
        document.documentElement.removeAttribute('data-bs-theme')
    }
    
    return cachedDarkBg
}

// List of available Bootswatch themes (for CSS swap)
const bootswatchThemes = [
    'brite', 'cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'journal',
    'litera', 'lumen', 'lux', 'materia', 'minty', 'morph', 'pulse', 'quartz',
    'sandstone', 'simplex', 'sketchy', 'slate', 'solar', 'spacelab',
    'superhero', 'united', 'vapor', 'versa', 'yeti', 'zephyr'
]

// Bootswatch themes that are dark by default (use light mode to see standard appearance)
const darkByDefaultThemes = [
    'cyborg', 'darkly', 'slate', 'solar', 'superhero', 'vapor', 'quartz'
]

// ________________________________________________________________________________
// HELPER FUNCTIONS
// ________________________________________________________________________________

/**
 * Convert hex color to RGB object
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

/**
 * Darken a hex color by percentage
 */
function darken(hex, percent) {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    const factor = 1 - percent / 100
    const r = Math.max(0, Math.round(rgb.r * factor))
    const g = Math.max(0, Math.round(rgb.g * factor))
    const b = Math.max(0, Math.round(rgb.b * factor))
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Lighten a hex color by percentage
 */
function lighten(hex, percent) {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    const factor = percent / 100
    const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor))
    const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor))
    const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor))
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Determine if color is light (for text contrast)
 */
function isLightColor(hex) {
    const rgb = hexToRgb(hex)
    if (!rgb) return false
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
    return luminance > 0.5
}

/**
 * Auto-adjust semantic colors for dark mode
 * Lightens colors for better visibility on dark backgrounds
 */
function adjustForDarkMode(hex) {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    // If already light, return as-is
    if (isLightColor(hex)) return hex
    // Lighten dark colors by 25% for dark mode visibility
    return lighten(hex, 25)
}

/**
 * Generate dark mode semantic colors from light mode colors
 * Note: 'light' and 'dark' semantic colors are kept as-is to maintain
 * their purpose (light for light text/backgrounds, dark for dark text/backgrounds)
 */
function generateDarkModeColors(colors) {
    const darkColors = {}
    for (const [name, hex] of Object.entries(colors)) {
        // 'light' and 'dark' semantic colors should remain as-is
        // so that text-light remains light (readable on dark backgrounds)
        // and text-dark remains dark (readable on light backgrounds)
        if (name === 'light' || name === 'dark') {
            darkColors[name] = hex
        } else {
            darkColors[name] = adjustForDarkMode(hex)
        }
    }
    return darkColors
}

/**
 * Generate complete Bootstrap CSS overrides compatible with bootstrap-theme-vars.css
 * Supports both light and dark themes via [data-bs-theme] attribute.
 */
function generateBootstrapCSS(colors, lightBg, darkBg) {
    let css = `/**
 * Bootstrap 5.3 Theme Variable Overrides
 * 
 * This file forces Bootstrap components to use CSS custom properties (CSS variables)
 * instead of hardcoded color values. This enables runtime theme changes by updating
 * the --bs-* CSS variables on :root.
 * 
 * Supports both light and dark themes via [data-bs-theme] attribute.
 * Generated by: C0ckp1t Theme Editor
 */\n\n`

    // Generate dark mode colors automatically
    const darkColors = generateDarkModeColors(colors)

    // ========== LIGHT THEME (Default) ==========
    css += `/* ========== LIGHT THEME (Default) ========== */\n`
    css += `:root,\n[data-bs-theme="light"] {\n`

    // Semantic colors for light mode
    css += `    /* Bootstrap semantic colors */\n`
    for (const [name, hex] of Object.entries(colors)) {
        const rgb = hexToRgb(hex)
        if (rgb) {
            css += `    --bs-${name}: ${hex};\n`
            css += `    --bs-${name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`
        }
    }

    // Body colors for light mode
    css += `\n    /* Body colors */\n`
    css += `    --bs-body-bg: ${lightBg.bodyBg};\n`
    const lightBodyBgRgb = hexToRgb(lightBg.bodyBg)
    css += `    --bs-body-bg-rgb: ${lightBodyBgRgb ? `${lightBodyBgRgb.r}, ${lightBodyBgRgb.g}, ${lightBodyBgRgb.b}` : '255, 255, 255'};\n`
    css += `    --bs-body-color: ${lightBg.bodyColor};\n`
    const lightBodyColorRgb = hexToRgb(lightBg.bodyColor)
    css += `    --bs-body-color-rgb: ${lightBodyColorRgb ? `${lightBodyColorRgb.r}, ${lightBodyColorRgb.g}, ${lightBodyColorRgb.b}` : '33, 37, 41'};\n`

    // Semantic background colors for light mode
    css += `\n    /* Semantic background colors (for bg-body-secondary, bg-body-tertiary) */\n`
    css += `    --bs-secondary-bg: ${lightBg.secondaryBg};\n`
    const lightSecondaryBgRgb = hexToRgb(lightBg.secondaryBg)
    css += `    --bs-secondary-bg-rgb: ${lightSecondaryBgRgb ? `${lightSecondaryBgRgb.r}, ${lightSecondaryBgRgb.g}, ${lightSecondaryBgRgb.b}` : '233, 236, 239'};\n`
    css += `    --bs-tertiary-bg: ${lightBg.tertiaryBg};\n`
    const lightTertiaryBgRgb = hexToRgb(lightBg.tertiaryBg)
    css += `    --bs-tertiary-bg-rgb: ${lightTertiaryBgRgb ? `${lightTertiaryBgRgb.r}, ${lightTertiaryBgRgb.g}, ${lightTertiaryBgRgb.b}` : '248, 249, 250'};\n`

    // Border colors for light mode
    css += `\n    /* Border colors */\n`
    css += `    --bs-border-color: ${lightBg.borderColor};\n`
    const lightBorderRgb = hexToRgb(lightBg.borderColor)
    css += `    --bs-border-color-translucent: rgba(${lightBorderRgb ? `${lightBorderRgb.r}, ${lightBorderRgb.g}, ${lightBorderRgb.b}` : '0, 0, 0'}, 0.175);\n`

    // Emphasis colors for light mode
    css += `\n    /* Emphasis colors */\n`
    css += `    --bs-emphasis-color: ${lightBg.emphasisColor};\n`
    const lightEmphasisRgb = hexToRgb(lightBg.emphasisColor)
    css += `    --bs-emphasis-color-rgb: ${lightEmphasisRgb ? `${lightEmphasisRgb.r}, ${lightEmphasisRgb.g}, ${lightEmphasisRgb.b}` : '0, 0, 0'};\n`
    css += `}\n\n`

    // ========== DARK THEME ==========
    css += `/* ========== DARK THEME ========== */\n`
    css += `[data-bs-theme="dark"] {\n`

    // Semantic colors for dark mode (auto-adjusted)
    css += `    /* Bootstrap semantic colors - adjusted for dark theme */\n`
    for (const [name, hex] of Object.entries(darkColors)) {
        const rgb = hexToRgb(hex)
        if (rgb) {
            css += `    --bs-${name}: ${hex};\n`
            css += `    --bs-${name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`
        }
    }

    // Body colors for dark mode
    css += `\n    /* Body colors */\n`
    css += `    --bs-body-bg: ${darkBg.bodyBg};\n`
    const darkBodyBgRgb = hexToRgb(darkBg.bodyBg)
    css += `    --bs-body-bg-rgb: ${darkBodyBgRgb ? `${darkBodyBgRgb.r}, ${darkBodyBgRgb.g}, ${darkBodyBgRgb.b}` : '30, 30, 30'};\n`
    css += `    --bs-body-color: ${darkBg.bodyColor};\n`
    const darkBodyColorRgb = hexToRgb(darkBg.bodyColor)
    css += `    --bs-body-color-rgb: ${darkBodyColorRgb ? `${darkBodyColorRgb.r}, ${darkBodyColorRgb.g}, ${darkBodyColorRgb.b}` : '212, 212, 212'};\n`

    // Semantic background colors for dark mode
    css += `\n    /* Semantic background colors */\n`
    css += `    --bs-secondary-bg: ${darkBg.secondaryBg};\n`
    const darkSecondaryBgRgb = hexToRgb(darkBg.secondaryBg)
    css += `    --bs-secondary-bg-rgb: ${darkSecondaryBgRgb ? `${darkSecondaryBgRgb.r}, ${darkSecondaryBgRgb.g}, ${darkSecondaryBgRgb.b}` : '45, 45, 45'};\n`
    css += `    --bs-tertiary-bg: ${darkBg.tertiaryBg};\n`
    const darkTertiaryBgRgb = hexToRgb(darkBg.tertiaryBg)
    css += `    --bs-tertiary-bg-rgb: ${darkTertiaryBgRgb ? `${darkTertiaryBgRgb.r}, ${darkTertiaryBgRgb.g}, ${darkTertiaryBgRgb.b}` : '58, 58, 58'};\n`

    // Border colors for dark mode
    css += `\n    /* Border colors */\n`
    css += `    --bs-border-color: ${darkBg.borderColor};\n`
    const darkBorderRgb = hexToRgb(darkBg.borderColor)
    css += `    --bs-border-color-translucent: rgba(${darkBorderRgb ? `${darkBorderRgb.r}, ${darkBorderRgb.g}, ${darkBorderRgb.b}` : '255, 255, 255'}, 0.15);\n`

    // Emphasis colors for dark mode
    css += `\n    /* Emphasis colors */\n`
    css += `    --bs-emphasis-color: ${darkBg.emphasisColor};\n`
    const darkEmphasisRgb = hexToRgb(darkBg.emphasisColor)
    css += `    --bs-emphasis-color-rgb: ${darkEmphasisRgb ? `${darkEmphasisRgb.r}, ${darkEmphasisRgb.g}, ${darkEmphasisRgb.b}` : '255, 255, 255'};\n`
    css += `}\n\n`

    // ========== SEMANTIC BACKGROUND UTILITIES ==========
    css += `/* ========== SEMANTIC BACKGROUND UTILITIES ========== */\n`
    css += `.bg-body {\n    background-color: var(--bs-body-bg) !important;\n}\n\n`
    css += `.bg-body-secondary {\n    background-color: var(--bs-secondary-bg) !important;\n}\n\n`
    css += `.bg-body-tertiary {\n    background-color: var(--bs-tertiary-bg) !important;\n}\n\n`

    // ========== BUTTONS - SOLID ==========
    css += `/* ========== BUTTONS - SOLID ========== */\n`
    for (const name of Object.keys(colors)) {
        css += `.btn-${name} {\n`
        css += `    --bs-btn-bg: var(--bs-${name});\n`
        css += `    --bs-btn-border-color: var(--bs-${name});\n`
        css += `}\n\n`
    }

    // ========== BUTTONS - OUTLINE ==========
    css += `/* ========== BUTTONS - OUTLINE ========== */\n`
    for (const name of Object.keys(colors)) {
        css += `.btn-outline-${name} {\n`
        css += `    --bs-btn-color: var(--bs-${name});\n`
        css += `    --bs-btn-border-color: var(--bs-${name});\n`
        css += `    --bs-btn-hover-bg: var(--bs-${name});\n`
        css += `    --bs-btn-hover-border-color: var(--bs-${name});\n`
        css += `    --bs-btn-active-bg: var(--bs-${name});\n`
        css += `    --bs-btn-active-border-color: var(--bs-${name});\n`
        css += `}\n\n`
    }

    // ========== BACKGROUNDS ==========
    css += `/* ========== BACKGROUNDS ========== */\n`
    for (const name of Object.keys(colors)) {
        css += `.bg-${name} {\n    background-color: var(--bs-${name}) !important;\n}\n\n`
    }

    // ========== TEXT COLORS ==========
    css += `/* ========== TEXT COLORS ========== */\n`
    for (const name of Object.keys(colors)) {
        css += `.text-${name} {\n    color: var(--bs-${name}) !important;\n}\n\n`
    }
    css += `.text-body {\n    color: var(--bs-body-color) !important;\n}\n\n`
    css += `.text-body-secondary {\n    color: var(--bs-secondary-color, rgba(var(--bs-body-color-rgb), 0.75)) !important;\n}\n\n`
    css += `.text-body-tertiary {\n    color: var(--bs-tertiary-color, rgba(var(--bs-body-color-rgb), 0.5)) !important;\n}\n\n`

    // ========== BORDERS ==========
    css += `/* ========== BORDERS ========== */\n`
    css += `.border {\n    border-color: var(--bs-border-color) !important;\n}\n\n`
    for (const name of Object.keys(colors)) {
        css += `.border-${name} {\n    border-color: var(--bs-${name}) !important;\n}\n\n`
    }

    // ========== ALERTS ==========
    css += `/* ========== ALERTS ========== */\n`
    for (const name of Object.keys(colors)) {
        css += `.alert-${name} {\n`
        css += `    --bs-alert-bg: rgba(var(--bs-${name}-rgb), 0.1);\n`
        css += `    --bs-alert-border-color: rgba(var(--bs-${name}-rgb), 0.25);\n`
        css += `    --bs-alert-color: var(--bs-${name});\n`
        css += `}\n\n`
    }

    // ========== BADGES ==========
    css += `/* ========== BADGES ========== */\n`
    for (const name of Object.keys(colors)) {
        css += `.badge.bg-${name} {\n    background-color: var(--bs-${name}) !important;\n}\n\n`
    }

    // ========== NAVIGATION ==========
    css += `/* ========== NAVIGATION ========== */\n`
    css += `.nav-pills .nav-link.active {\n    background-color: var(--bs-primary);\n}\n\n`
    css += `.navbar-dark {\n`
    css += `    --bs-navbar-brand-color: rgba(255, 255, 255, 1);\n`
    css += `    --bs-navbar-brand-hover-color: rgba(255, 255, 255, 1);\n`
    css += `}\n\n`

    // ========== PROGRESS BARS ==========
    css += `/* ========== PROGRESS BARS ========== */\n`
    css += `.progress-bar {\n    background-color: var(--bs-primary);\n}\n\n`
    for (const name of ['success', 'info', 'warning', 'danger']) {
        css += `.progress-bar.bg-${name} {\n    background-color: var(--bs-${name}) !important;\n}\n\n`
    }

    // ========== FORMS ==========
    css += `/* ========== FORMS ========== */\n`
    css += `.form-control:focus,\n.form-select:focus {\n`
    css += `    border-color: var(--bs-primary);\n`
    css += `    box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);\n`
    css += `}\n\n`
    css += `.form-check-input:checked {\n`
    css += `    background-color: var(--bs-primary);\n`
    css += `    border-color: var(--bs-primary);\n`
    css += `}\n\n`
    css += `.form-switch .form-check-input:checked {\n`
    css += `    background-color: var(--bs-primary);\n`
    css += `    border-color: var(--bs-primary);\n`
    css += `}\n\n`

    // ========== LINKS ==========
    css += `/* ========== LINKS ========== */\n`
    css += `a {\n    color: var(--bs-primary);\n}\n\n`
    css += `a:hover {\n    color: var(--bs-primary);\n    opacity: 0.85;\n}\n\n`

    // ========== LIST GROUP ==========
    css += `/* ========== LIST GROUP ========== */\n`
    css += `.list-group-item.active {\n`
    css += `    background-color: var(--bs-primary);\n`
    css += `    border-color: var(--bs-primary);\n`
    css += `}\n\n`

    // ========== PAGINATION ==========
    css += `/* ========== PAGINATION ========== */\n`
    css += `.page-link {\n    color: var(--bs-primary);\n}\n\n`
    css += `.page-link:hover {\n    color: var(--bs-primary);\n}\n\n`
    css += `.page-item.active .page-link {\n`
    css += `    background-color: var(--bs-primary);\n`
    css += `    border-color: var(--bs-primary);\n`
    css += `}\n\n`

    // ========== SPINNERS ==========
    css += `/* ========== SPINNERS ========== */\n`
    for (const name of Object.keys(colors)) {
        css += `.spinner-border.text-${name},\n.spinner-grow.text-${name} {\n`
        css += `    color: var(--bs-${name}) !important;\n`
        css += `}\n\n`
    }

    // ========== ACCORDION ==========
    css += `/* ========== ACCORDION ========== */\n`
    css += `.accordion-button:not(.collapsed) {\n`
    css += `    background-color: rgba(var(--bs-primary-rgb), 0.1);\n`
    css += `    color: var(--bs-primary);\n`
    css += `}\n\n`
    css += `.accordion-button:focus {\n`
    css += `    border-color: var(--bs-primary);\n`
    css += `    box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);\n`
    css += `}\n\n`

    // ========== BREADCRUMB ==========
    css += `/* ========== BREADCRUMB ========== */\n`
    css += `.breadcrumb-item.active {\n    color: var(--bs-primary);\n}\n\n`

    // ========== CARDS ==========
    css += `/* ========== CARDS ========== */\n`
    css += `.card {\n`
    css += `    --bs-card-bg: var(--bs-body-bg);\n`
    css += `    --bs-card-border-color: var(--bs-border-color);\n`
    css += `}\n\n`

    // ========== TABLES ==========
    css += `/* ========== TABLES ========== */\n`
    css += `.table {\n`
    css += `    --bs-table-bg: transparent;\n`
    css += `    --bs-table-color: var(--bs-body-color);\n`
    css += `    --bs-table-border-color: var(--bs-border-color);\n`
    css += `}\n\n`

    // ========== MODALS ==========
    css += `/* ========== MODALS ========== */\n`
    css += `.modal-content {\n`
    css += `    --bs-modal-bg: var(--bs-body-bg);\n`
    css += `    --bs-modal-border-color: var(--bs-border-color);\n`
    css += `}\n\n`

    // ========== DROPDOWNS ==========
    css += `/* ========== DROPDOWNS ========== */\n`
    css += `.dropdown-menu {\n`
    css += `    --bs-dropdown-bg: var(--bs-body-bg);\n`
    css += `    --bs-dropdown-border-color: var(--bs-border-color);\n`
    css += `    --bs-dropdown-link-color: var(--bs-body-color);\n`
    css += `}\n`

    return css
}

/**
 * Apply theme to DOM by injecting CSS
 * @param {Object} colors - Semantic colors object
 * @param {Object} lightBg - Light mode background colors
 * @param {Object} darkBg - Dark mode background colors
 * @returns {string} - Generated CSS string
 */
function applyThemeToDOM(colors, lightBg, darkBg) {
    const css = generateBootstrapCSS(colors, lightBg, darkBg)

    // Inject/update dynamic style element
    let styleEl = document.getElementById(THEME_STYLE_ID)
    if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = THEME_STYLE_ID
        document.head.appendChild(styleEl)
    }
    styleEl.textContent = css

    return css
}

/**
 * Load a Bootswatch theme via CSS swap (complete Bootstrap CSS replacement)
 * This gives 100% accurate Bootswatch rendering
 * @param {string} themeName - Name of the Bootswatch theme
 * @param {Function} setThemeMode - Callback to set theme mode (light/dark)
 */
function loadBootswatchTheme(themeName, setThemeMode) {
    // Remove dynamic theme style element (CSS variable overrides)
    const dynamicStyle = document.getElementById(THEME_STYLE_ID)
    if (dynamicStyle) {
        dynamicStyle.remove()
    }

    // Disable bootstrap-theme-vars.css (it uses !important)
    const themeVarsLink = document.getElementById(THEME_VARS_LINK_ID)
    if (themeVarsLink) {
        themeVarsLink.disabled = true
    }

    // Disable the original Bootstrap CSS - Bootswatch CSS is a complete replacement
    const bootstrapMainLink = document.getElementById(BOOTSTRAP_MAIN_ID)
    if (bootstrapMainLink) {
        bootstrapMainLink.disabled = true
    } else {
        // It is important to insert the Bootswatch CSS after certain styles, and this
        //  determines where it will be inserted.
        logger.warn("The original bootstrap.min.css is missing (bad because will insert at bottom)")
    }

    // Find or create the Bootswatch link element
    let bootswatchLink = document.getElementById(BOOTSWATCH_LINK_ID)
    if (!bootswatchLink) {
        bootswatchLink = document.createElement('link')
        bootswatchLink.id = BOOTSWATCH_LINK_ID
        bootswatchLink.rel = 'stylesheet'
        // Insert after the main bootstrap.min.css (even though it's disabled)
        if (bootstrapMainLink) {
            bootstrapMainLink.parentNode.insertBefore(bootswatchLink, bootstrapMainLink.nextSibling)
        } else {
            document.head.appendChild(bootswatchLink)
        }
    }

    // Set the href to load the Bootswatch CSS
    // bootswatchLink.href = `/css/bootwatch/${themeName}/bootstrap.min.css`
    bootswatchLink.href = `${store.bootswatchURL}/${themeName}/bootstrap.min.css`
    bootswatchLink.disabled = false

    // Set to light mode by default for consistent viewing
    if (setThemeMode) {
        setThemeMode('light')
    }
}

/**
 * Restore custom editor mode (CSS variable overrides)
 * Reverses the CSS swap and re-enables the theme editor
 * @param {Object} colors - Semantic colors object
 * @param {Object} lightBg - Light mode background colors
 * @param {Object} darkBg - Dark mode background colors
 * @returns {string} - Generated CSS string
 */
function restoreCustomEditor(colors, lightBg, darkBg) {
    // Remove/disable Bootswatch CSS link
    const bootswatchLink = document.getElementById(BOOTSWATCH_LINK_ID)
    if (bootswatchLink) {
        bootswatchLink.disabled = true
        bootswatchLink.href = ''
    }

    // Re-enable the original Bootstrap CSS
    const bootstrapMainLink = document.getElementById(BOOTSTRAP_MAIN_ID)
    if (bootstrapMainLink) {
        bootstrapMainLink.disabled = false
    }

    // Re-enable bootstrap-theme-vars.css
    const themeVarsLink = document.getElementById(THEME_VARS_LINK_ID)
    if (themeVarsLink) {
        themeVarsLink.disabled = false
    }

    // Re-apply dynamic theme
    return applyThemeToDOM(colors, lightBg, darkBg)
}

// Bootswatch color presets extracted from _variables.scss files
// These work with the CSS variable override system
const bootswatchPresets = {
    brite: {
        colors: {
            primary: '#a2e436',
            secondary: '#ffffff',
            success: '#68d391',
            danger: '#f56565',
            warning: '#ffc700',
            info: '#22d2ed',
            light: '#e9ecef',
            dark: '#000000'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#212529',
            secondaryBg: '#e9ecef',
            tertiaryBg: '#f8f9fa',
            borderColor: '#000000',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    cerulean: {
        colors: {
            primary: '#2fa4e7',
            secondary: '#e9ecef',
            success: '#73a839',
            danger: '#c71c22',
            warning: '#dd5600',
            info: '#033c73',
            light: '#f8f9fa',
            dark: '#343a40'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#495057',
            secondaryBg: '#e9ecef',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dee2e6',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    cosmo: {
        colors: {
            primary: '#2780e3',
            secondary: '#373a3c',
            success: '#3fb618',
            danger: '#ff0039',
            warning: '#ff7518',
            info: '#9954bb',
            light: '#f8f9fa',
            dark: '#373a3c'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#373a3c',
            secondaryBg: '#e9ecef',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dee2e6',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    cyborg: {
        colors: {
            primary: '#2a9fd6',
            secondary: '#555555',
            success: '#77b300',
            danger: '#cc0000',
            warning: '#ff8800',
            info: '#9933cc',
            light: '#222222',
            dark: '#adafae'
        },
        lightBg: {
            bodyBg: '#060606',
            bodyColor: '#adafae',
            secondaryBg: '#222222',
            tertiaryBg: '#282828',
            borderColor: '#282828',
            emphasisColor: '#ffffff'
        },
        darkBg: {
            bodyBg: '#060606',
            bodyColor: '#adafae',
            secondaryBg: '#222222',
            tertiaryBg: '#282828',
            borderColor: '#282828',
            emphasisColor: '#ffffff'
        }
    },
    darkly: {
        colors: {
            primary: '#375a7f',
            secondary: '#444444',
            success: '#00bc8c',
            danger: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db',
            light: '#adb5bd',
            dark: '#303030'
        },
        lightBg: {
            bodyBg: '#222222',
            bodyColor: '#ffffff',
            secondaryBg: '#303030',
            tertiaryBg: '#444444',
            borderColor: '#444444',
            emphasisColor: '#ffffff'
        },
        darkBg: {
            bodyBg: '#222222',
            bodyColor: '#ffffff',
            secondaryBg: '#303030',
            tertiaryBg: '#444444',
            borderColor: '#444444',
            emphasisColor: '#ffffff'
        }
    },
    flatly: {
        colors: {
            primary: '#2c3e50',
            secondary: '#95a5a6',
            success: '#18bc9c',
            danger: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db',
            light: '#ecf0f1',
            dark: '#7b8a8b'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#212529',
            secondaryBg: '#ecf0f1',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dee2e6',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    journal: {
        colors: {
            primary: '#eb6864',
            secondary: '#aaaaaa',
            success: '#22b24c',
            danger: '#f57a00',
            warning: '#f5e625',
            info: '#336699',
            light: '#f8f9fa',
            dark: '#222222'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#212529',
            secondaryBg: '#eeeeee',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dee2e6',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    litera: {
        colors: {
            primary: '#4582ec',
            secondary: '#adb5bd',
            success: '#02b875',
            danger: '#d9534f',
            warning: '#f0ad4e',
            info: '#17a2b8',
            light: '#f8f9fa',
            dark: '#343a40'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#343a40',
            secondaryBg: '#e9ecef',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dddddd',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    lumen: {
        colors: {
            primary: '#158cba',
            secondary: '#f0f0f0',
            success: '#28b62c',
            danger: '#ff4136',
            warning: '#ff851b',
            info: '#75caeb',
            light: '#f6f6f6',
            dark: '#555555'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#212529',
            secondaryBg: '#f0f0f0',
            tertiaryBg: '#f6f6f6',
            borderColor: '#dee2e6',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    lux: {
        colors: {
            primary: '#1a1a1a',
            secondary: '#ffffff',
            success: '#4bbf73',
            danger: '#d9534f',
            warning: '#f0ad4e',
            info: '#1f9bcf',
            light: '#f0f1f2',
            dark: '#343a40'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#55595c',
            secondaryBg: '#f0f1f2',
            tertiaryBg: '#f8f9fa',
            borderColor: '#e0e1e2',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    materia: {
        colors: {
            primary: '#2196f3',
            secondary: '#ffffff',
            success: '#4caf50',
            danger: '#e51c23',
            warning: '#ff9800',
            info: '#9c27b0',
            light: '#f8f9fa',
            dark: '#222222'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#444444',
            secondaryBg: '#eeeeee',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dee2e6',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    minty: {
        colors: {
            primary: '#78c2ad',
            secondary: '#f3969a',
            success: '#56cc9d',
            danger: '#ff7851',
            warning: '#ffce67',
            info: '#6cc3d5',
            light: '#f8f9fa',
            dark: '#343a40'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#888888',
            secondaryBg: '#f7f7f9',
            tertiaryBg: '#f8f9fa',
            borderColor: '#eceeef',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    morph: {
        colors: {
            primary: '#378dfc',
            secondary: '#d9e3f1',
            success: '#43cc29',
            danger: '#e52527',
            warning: '#ffc107',
            info: '#5b62f4',
            light: '#f0f5fa',
            dark: '#212529'
        },
        lightBg: {
            bodyBg: '#d9e3f1',
            bodyColor: '#7b8ab8',
            secondaryBg: '#e9ecef',
            tertiaryBg: '#f0f5fa',
            borderColor: '#bed1e6',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    pulse: {
        colors: {
            primary: '#593196',
            secondary: '#a991d4',
            success: '#13b955',
            danger: '#fc3939',
            warning: '#efa31d',
            info: '#009cdc',
            light: '#f9f8fc',
            dark: '#17141f'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#444444',
            secondaryBg: '#f9f8fc',
            tertiaryBg: '#fafafa',
            borderColor: '#ededed',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    quartz: {
        colors: {
            primary: '#e83283',
            secondary: '#ffffff66',
            success: '#41d7a7',
            danger: '#fd7e14',
            warning: '#ffc107',
            info: '#39cbfb',
            light: '#e9e9e8',
            dark: '#212529'
        },
        lightBg: {
            bodyBg: '#686dc3',
            bodyColor: '#ffffff',
            secondaryBg: '#5b62f4',
            tertiaryBg: '#7a7fd1',
            borderColor: '#ffffff33',
            emphasisColor: '#ffffff'
        },
        darkBg: {
            bodyBg: '#686dc3',
            bodyColor: '#ffffff',
            secondaryBg: '#5b62f4',
            tertiaryBg: '#7a7fd1',
            borderColor: '#ffffff33',
            emphasisColor: '#ffffff'
        }
    },
    sandstone: {
        colors: {
            primary: '#325d88',
            secondary: '#8e8c84',
            success: '#93c54b',
            danger: '#d9534f',
            warning: '#f47c3c',
            info: '#29abe0',
            light: '#f8f5f0',
            dark: '#3e3f3a'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#3e3f3a',
            secondaryBg: '#f8f5f0',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dfd7ca',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    simplex: {
        colors: {
            primary: '#d9230f',
            secondary: '#ffffff',
            success: '#469408',
            danger: '#9b479f',
            warning: '#d9831f',
            info: '#029acf',
            light: '#ffffff',
            dark: '#373a3c'
        },
        lightBg: {
            bodyBg: '#fcfcfc',
            bodyColor: '#212529',
            secondaryBg: '#dddddd',
            tertiaryBg: '#f8f9fa',
            borderColor: '#cccccc',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    sketchy: {
        colors: {
            primary: '#333333',
            secondary: '#555555',
            success: '#28a745',
            danger: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8',
            light: '#ffffff',
            dark: '#555555'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#212529',
            secondaryBg: '#f7f7f9',
            tertiaryBg: '#f8f9fa',
            borderColor: '#333333',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    slate: {
        colors: {
            primary: '#3a3f44',
            secondary: '#7a8288',
            success: '#62c462',
            danger: '#ee5f5b',
            warning: '#f89406',
            info: '#5bc0de',
            light: '#e9ecef',
            dark: '#272b30'
        },
        lightBg: {
            bodyBg: '#272b30',
            bodyColor: '#aaaaaa',
            secondaryBg: '#3a3f44',
            tertiaryBg: '#52575c',
            borderColor: '#1a1a1a',
            emphasisColor: '#ffffff'
        },
        darkBg: {
            bodyBg: '#272b30',
            bodyColor: '#aaaaaa',
            secondaryBg: '#3a3f44',
            tertiaryBg: '#52575c',
            borderColor: '#1a1a1a',
            emphasisColor: '#ffffff'
        }
    },
    solar: {
        colors: {
            primary: '#b58900',
            secondary: '#839496',
            success: '#2aa198',
            danger: '#d33682',
            warning: '#cb4b16',
            info: '#268bd2',
            light: '#fdf6e3',
            dark: '#073642'
        },
        lightBg: {
            bodyBg: '#002b36',
            bodyColor: '#839496',
            secondaryBg: '#073642',
            tertiaryBg: '#094050',
            borderColor: '#073642',
            emphasisColor: '#fdf6e3'
        },
        darkBg: {
            bodyBg: '#002b36',
            bodyColor: '#839496',
            secondaryBg: '#073642',
            tertiaryBg: '#094050',
            borderColor: '#073642',
            emphasisColor: '#fdf6e3'
        }
    },
    spacelab: {
        colors: {
            primary: '#446e9b',
            secondary: '#999999',
            success: '#3cb521',
            danger: '#cd0200',
            warning: '#d47500',
            info: '#3399f3',
            light: '#eeeeee',
            dark: '#333333'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#777777',
            secondaryBg: '#eeeeee',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dee2e6',
            emphasisColor: '#2d2d2d'
        },
        darkBg: {...defaultDarkBg}
    },
    superhero: {
        colors: {
            primary: '#df6919',
            secondary: '#4e5d6c',
            success: '#5cb85c',
            danger: '#d9534f',
            warning: '#ffc107',
            info: '#5bc0de',
            light: '#abb6c2',
            dark: '#20374c'
        },
        lightBg: {
            bodyBg: '#0f2537',
            bodyColor: '#ebebeb',
            secondaryBg: '#20374c',
            tertiaryBg: '#4e5d6c',
            borderColor: '#4e5d6c',
            emphasisColor: '#ffffff'
        },
        darkBg: {
            bodyBg: '#0f2537',
            bodyColor: '#ebebeb',
            secondaryBg: '#20374c',
            tertiaryBg: '#4e5d6c',
            borderColor: '#4e5d6c',
            emphasisColor: '#ffffff'
        }
    },
    united: {
        colors: {
            primary: '#e95420',
            secondary: '#aea79f',
            success: '#38b44a',
            danger: '#df382c',
            warning: '#efb73e',
            info: '#17a2b8',
            light: '#e9ecef',
            dark: '#772953'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#333333',
            secondaryBg: '#e9ecef',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dee2e6',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    vapor: {
        colors: {
            primary: '#6f42c1',
            secondary: '#ea39b8',
            success: '#3cf281',
            danger: '#e44c55',
            warning: '#ffc107',
            info: '#1ba2f6',
            light: '#44d9e8',
            dark: '#170229'
        },
        lightBg: {
            bodyBg: '#1a0933',
            bodyColor: '#32fbe2',
            secondaryBg: '#2a1045',
            tertiaryBg: '#3d1560',
            borderColor: '#6f42c1',
            emphasisColor: '#ffffff'
        },
        darkBg: {
            bodyBg: '#1a0933',
            bodyColor: '#32fbe2',
            secondaryBg: '#2a1045',
            tertiaryBg: '#3d1560',
            borderColor: '#6f42c1',
            emphasisColor: '#ffffff'
        }
    },
    versa: {
        colors: {
            primary: '#161616',
            secondary: '#ffffff',
            success: '#04c951',
            danger: '#e7020b',
            warning: '#efb100',
            info: '#2b80ff',
            light: '#f5f5f5',
            dark: '#2e2e2e'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#0a0a0a',
            secondaryBg: '#f5f5f5',
            tertiaryBg: '#f8f9fa',
            borderColor: '#e5e5e5',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    yeti: {
        colors: {
            primary: '#008cba',
            secondary: '#eeeeee',
            success: '#43ac6a',
            danger: '#f04124',
            warning: '#e99002',
            info: '#5bc0de',
            light: '#eeeeee',
            dark: '#333333'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#212529',
            secondaryBg: '#eeeeee',
            tertiaryBg: '#f8f9fa',
            borderColor: '#cccccc',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    },
    zephyr: {
        colors: {
            primary: '#3459e6',
            secondary: '#ffffff',
            success: '#2fb380',
            danger: '#da292e',
            warning: '#f4bd61',
            info: '#287bb5',
            light: '#f8f9fa',
            dark: '#212529'
        },
        lightBg: {
            bodyBg: '#ffffff',
            bodyColor: '#495057',
            secondaryBg: '#e9ecef',
            tertiaryBg: '#f8f9fa',
            borderColor: '#dee2e6',
            emphasisColor: '#000000'
        },
        darkBg: {...defaultDarkBg}
    }
}

/**
 * Initialize default colors by reading actual CSS values from the DOM.
 * Should be called when the DOM is ready (e.g., in Vue's onMounted).
 * Updates the defaultColors, defaultLightBg, and defaultDarkBg objects in place.
 * @returns {Object} - Object containing { colors, lightBg, darkBg }
 */
function initializeDefaultColors() {
    // Clear caches to force re-read from current CSS
    cachedDefaultColors = null
    cachedLightBg = null
    cachedDarkBg = null
    
    // Read semantic colors
    const colors = getDefaultColors()
    Object.assign(defaultColors, colors)
    
    // Read light mode background colors
    const lightBg = getLightBgColors()
    Object.assign(defaultLightBg, lightBg)
    
    // Read dark mode background colors
    const darkBg = getDarkBgColors()
    Object.assign(defaultDarkBg, darkBg)
    
    return { colors, lightBg, darkBg }
}

export const Theme = {
    // Constants
    defaultColors,
    defaultLightBg,
    defaultDarkBg,
    bootswatchThemes,
    bootswatchPresets,
    darkByDefaultThemes,

    // DOM IDs
    THEME_STYLE_ID,
    BOOTSWATCH_LINK_ID,
    THEME_VARS_LINK_ID,
    BOOTSTRAP_MAIN_ID,

    // Helper functions
    hexToRgb,
    darken,
    lighten,
    isLightColor,
    adjustForDarkMode,
    generateDarkModeColors,
    generateBootstrapCSS,
    applyThemeToDOM,
    loadBootswatchTheme,
    restoreCustomEditor,
    initializeDefaultColors,

    // Labels for UI

    colorLabels: {
        primary: 'Primary',
        secondary: 'Secondary',
        success: 'Success',
        danger: 'Danger',
        warning: 'Warning',
        info: 'Info',
        light: 'Light',
        dark: 'Dark'
    },

    lightBgLabels: {
        bodyBg: 'Body Background',
        bodyColor: 'Body Text',
        secondaryBg: 'Secondary Background',
        tertiaryBg: 'Tertiary Background',
        borderColor: 'Border Color',
        emphasisColor: 'Emphasis Color'
    },

    darkBgLabels: {
        bodyBg: 'Body Background',
        bodyColor: 'Body Text',
        secondaryBg: 'Secondary Background',
        tertiaryBg: 'Tertiary Background',
        borderColor: 'Border Color',
        emphasisColor: 'Emphasis Color'
    },

    presets: {
        default: {
            colors: {...defaultColors},
            lightBg: {...defaultLightBg},
            darkBg: {...defaultDarkBg}
        },
        ocean: {
            colors: {
                primary: '#0077b6',
                secondary: '#90e0ef',
                success: '#2d6a4f',
                danger: '#d62828',
                warning: '#ffba08',
                info: '#48cae4',
                light: '#caf0f8',
                dark: '#023e8a'
            },
            lightBg: {
                bodyBg: '#ffffff',
                bodyColor: '#023e8a',
                secondaryBg: '#caf0f8',
                tertiaryBg: '#e0f7fa',
                borderColor: '#90e0ef',
                emphasisColor: '#000000'
            },
            darkBg: {
                bodyBg: '#03045e',
                bodyColor: '#caf0f8',
                secondaryBg: '#023e8a',
                tertiaryBg: '#0077b6',
                borderColor: '#0096c7',
                emphasisColor: '#ffffff'
            }
        },
        forest: {
            colors: {
                primary: '#2d6a4f',
                secondary: '#74c69d',
                success: '#40916c',
                danger: '#ae2012',
                warning: '#ee9b00',
                info: '#52b788',
                light: '#d8f3dc',
                dark: '#1b4332'
            },
            lightBg: {
                bodyBg: '#ffffff',
                bodyColor: '#1b4332',
                secondaryBg: '#d8f3dc',
                tertiaryBg: '#b7e4c7',
                borderColor: '#74c69d',
                emphasisColor: '#000000'
            },
            darkBg: {
                bodyBg: '#081c15',
                bodyColor: '#d8f3dc',
                secondaryBg: '#1b4332',
                tertiaryBg: '#2d6a4f',
                borderColor: '#40916c',
                emphasisColor: '#ffffff'
            }
        },
        sunset: {
            colors: {
                primary: '#e63946',
                secondary: '#f4a261',
                success: '#2a9d8f',
                danger: '#9b2226',
                warning: '#e9c46a',
                info: '#264653',
                light: '#f1faee',
                dark: '#1d3557'
            },
            lightBg: {
                bodyBg: '#f1faee',
                bodyColor: '#1d3557',
                secondaryBg: '#a8dadc',
                tertiaryBg: '#e9ecef',
                borderColor: '#457b9d',
                emphasisColor: '#000000'
            },
            darkBg: {
                bodyBg: '#1d3557',
                bodyColor: '#f1faee',
                secondaryBg: '#264653',
                tertiaryBg: '#2a3f5f',
                borderColor: '#457b9d',
                emphasisColor: '#ffffff'
            }
        },
        purple: {
            colors: {
                primary: '#7b2cbf',
                secondary: '#c77dff',
                success: '#38b000',
                danger: '#d00000',
                warning: '#ffaa00',
                info: '#9d4edd',
                light: '#e0aaff',
                dark: '#3c096c'
            },
            lightBg: {
                bodyBg: '#ffffff',
                bodyColor: '#3c096c',
                secondaryBg: '#e0aaff',
                tertiaryBg: '#f3d5ff',
                borderColor: '#c77dff',
                emphasisColor: '#000000'
            },
            darkBg: {
                bodyBg: '#10002b',
                bodyColor: '#e0aaff',
                secondaryBg: '#240046',
                tertiaryBg: '#3c096c',
                borderColor: '#5a189a',
                emphasisColor: '#ffffff'
            }
        },
        monochrome: {
            colors: {
                primary: '#495057',
                secondary: '#6c757d',
                success: '#495057',
                danger: '#343a40',
                warning: '#adb5bd',
                info: '#868e96',
                light: '#f8f9fa',
                dark: '#212529'
            },
            lightBg: {
                bodyBg: '#ffffff',
                bodyColor: '#212529',
                secondaryBg: '#e9ecef',
                tertiaryBg: '#f8f9fa',
                borderColor: '#dee2e6',
                emphasisColor: '#000000'
            },
            darkBg: {
                bodyBg: '#121212',
                bodyColor: '#e9ecef',
                secondaryBg: '#1e1e1e',
                tertiaryBg: '#2d2d2d',
                borderColor: '#444444',
                emphasisColor: '#ffffff'
            }
        }
    }
}
