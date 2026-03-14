<script setup>
/*
  This component displays the Table of Contents for a Markdown document.
  
  Usage:
    <MdToc :v="markdownText" />
  
  Features:
    - Automatically extracts headings from markdown
    - Supports nested hierarchy (H1-H6)
    - Collapsible TOC with smooth animations
    - Smooth scroll to sections with normalized anchor IDs
    - Visual hierarchy with different markers per level
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, watch, onMounted} from 'vue'
import {getLogger} from "Logging";
import {slugify} from "../../components/MarkdownUtils.mjs"
import TocList from "./toc-list.vue";

// !# C0CKP1T_START imports
import { store as storeMain, api as apiMain } from 'GlobalStore'

const maximumTileTextLength = 32 
const props = defineProps({
  v: {
    type: String,
    required: true,
  },
  // Determines how deep to parse headings
  //  The more levels the more complex the TOC
  maxLevel: {
    type: Number,
    default: 3,
  }
})
// !# C0CKP1T_END



// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "md-toc.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// !# C0CKP1T_START script
const local = reactive({
  id: LOG_HEADER,
  toc: [],
  isCollapsed: false,
  isEmpty: true
})

/**
 * Create hierarchical TOC structure from markdown text
 * Extracts headings and builds nested structure based on heading levels
 * 
 * IMPORTANT: Skips headings inside code blocks (``` or ~~~)
 * This prevents bash comments (#) and other code from being treated as headings
 * 
 * @param {string} markdownText - Raw markdown text
 * @returns {Array} Hierarchical TOC structure
 */
function createTOCFromMarkdown(markdownText) {
  if (!markdownText || markdownText.trim() === '') {
    return []
  }

  const lines = markdownText.split('\n')
  const toc = []
  const stack = [toc]
  let inCodeBlock = false
  let codeBlockDelimiter = null

  lines.forEach(line => {
    const trimmedLine = line.trim()
    
    // Check for code block boundaries (``` or ~~~)
    // Match opening: ```bash, ```javascript, ``` (any or no language)
    // Match closing: ``` or ~~~ (must match the opening delimiter)
    if (trimmedLine.startsWith('```') || trimmedLine.startsWith('~~~')) {
      if (!inCodeBlock) {
        // Entering code block
        inCodeBlock = true
        codeBlockDelimiter = trimmedLine.startsWith('```') ? '```' : '~~~'
      } else if (trimmedLine.startsWith(codeBlockDelimiter)) {
        // Exiting code block (delimiter must match)
        inCodeBlock = false
        codeBlockDelimiter = null
      }
      return // Skip the code block delimiter line itself
    }

    // Skip lines inside code blocks
    if (inCodeBlock) {
      return
    }

    // Match markdown headings: ## Heading Text
    // Must be at start of line (after trimming leading spaces)
    const match = line.match(/^(#{1,6})\s+(.*)/)
    if (match) {
      const level = match[1].length
      
      // Skip headings deeper than maxLevel
      if (level > props.maxLevel) {
        return
      }
      
      // const text = match[2].trim()
      const fullText = match[2].trim()
      const text = fullText.length > maximumTileTextLength ? fullText.substring(0, maximumTileTextLength) + "..." : fullText
      
      // Use slugify for consistent anchor generation (matches markdown-it-anchor)
      const anchor = slugify(text)

      const entry = {text, anchor, fullText, children: []}

      // Adjust stack to current level
      while (stack.length > level) {
        stack.pop()
      }
      
      // Add entry at current level
      stack[stack.length - 1].push(entry)
      stack.push(entry.children)
    }
  })

  return toc
}

/**
 * Scroll to a section by anchor ID
 * Uses same normalization as xmarkdown.vue for consistency
 * 
 * @param {string} anchor - Anchor ID (with or without #)
 */
function scrollToSection(anchor) {
  // Remove # if present
  let id = anchor.startsWith('#') ? anchor.slice(1) : anchor
  
  // Normalize the ID to match header IDs
  const normalizedId = slugify(id)
  
  // Try normalized ID first
  let target = document.getElementById(normalizedId)
  
  // Fallback: try original ID
  if (!target && normalizedId !== id) {
    target = document.getElementById(id)
    logger.debug(`Trying original ID: ${id}`)
  }

  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    logger.debug(`Scrolled to section: ${anchor} (normalized: ${normalizedId})`)
  } else {
    logger.warn(`Section not found: ${anchor} (tried IDs: ${normalizedId}, ${id})`)
  }
}

/**
 * Toggle TOC collapsed state
 */
function toggleCollapse() {
  storeMain.isCollapsedTOC = !storeMain.isCollapsedTOC
  logger.debug(`TOC collapsed: ${storeMain.isCollapsedTOC}`)
}

/**
 * Update TOC when markdown text changes
 */
function updateTOC() {
  const newToc = createTOCFromMarkdown(props.v)
  local.toc = newToc
  local.isEmpty = newToc.length === 0
  
  logger.debug(`TOC updated: ${newToc.length} top-level items`)
}

// Watch for prop changes
watch(() => props.v, () => {
  updateTOC()
}, { immediate: true })

// !# C0CKP1T_END

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  // !# C0CKP1T_START init
  updateTOC()
  // !# C0CKP1T_END init
}

onMounted(async () => {
  init()
})
</script>

<template>
  <!--  !# C0CKP1T_START template -->
  <div v-if="!local.isEmpty" class="md-toc" :class="{'toc-collapsed': storeMain.isCollapsedTOC}">
    <!-- TOC Header with collapse button -->
    <div class="toc-header" @click="toggleCollapse" style="cursor: pointer;">
      <h3 class="toc-title">

       {{ storeMain.isCollapsedTOC ? 'TOC' : 'Table of Contents' }} 
      </h3>

      <button 
        class="toc-toggle-btn ms-2"
        :aria-label="storeMain.isCollapsedTOC ? 'Expand table of contents' : 'Collapse table of contents'"
      > {{ storeMain.isCollapsedTOC ? '▶' : '▼' }} </button>

    </div>

    <!-- TOC Navigation - recursive list -->
    <nav v-show="!storeMain.isCollapsedTOC" class="toc-nav">
      <TocList :items="local.toc" :level="0" @scroll-to="scrollToSection" />
    </nav>
  </div>
  <!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */

/* ============================================================================
   TOC Container
   ============================================================================ */
.md-toc {
  background-color: var(--color4);  /* #2d333b - component bg */
  border-left: 3px solid var(--color6);  /* #82b1ff - blue accent */
  border-radius: 6px;
  padding: 0.75rem;
  margin: 1.5rem 0;
  max-width: 100%;
  transition: all 0.3s ease;
}

.md-toc:hover {
  border-left-color: var(--color5);  /* Gold on hover */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* ============================================================================
   TOC Header
   ============================================================================ */
.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(130, 177, 255, 0.2);
}

.toc-title {
  color: var(--color6);  /* Blue */
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.toc-title i {
  font-size: 0.85rem;
}

.toc-toggle-btn {
  background: none;
  border: none;
  color: var(--color6);
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.toc-toggle-btn:hover {
  background-color: rgba(130, 177, 255, 0.1);
  color: var(--color5);  /* Gold */
}

.toc-toggle-btn:active {
  background-color: rgba(130, 177, 255, 0.2);
}

/* ============================================================================
   TOC Navigation
   ============================================================================ */
.toc-nav {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================================================
   Collapsed State
   ============================================================================ */
.toc-collapsed .toc-nav {
  display: none;
}

.toc-collapsed {
  padding-bottom: 0.75rem;
}

/* ============================================================================
   Responsive Design
   ============================================================================ */
@media (max-width: 768px) {
  .md-toc {
    padding: 0.75rem;
    margin: 1rem 0;
  }

  .toc-title {
    font-size: 0.9rem;
  }
}

/* !# C0CKP1T_END style */
</style>
