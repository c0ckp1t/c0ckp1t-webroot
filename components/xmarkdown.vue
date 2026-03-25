<!-- -------------------------------------------------------------------------------- -->
<!--                                 SCRIPT                                           -->
<!-- -------------------------------------------------------------------------------- -->
<script setup>
/*
    <XMarkdown :v="local.text"
               :fetchImage="apiMain.fetchImage"
               :fetchText="apiMain.fetchText"
               @href="href"
    ></XMarkdown>
*/
// ______________________________________________________________________________________
// IMPORT
// ______________________________________________________________________________________
import {reactive, ref, markRaw, onMounted,  watch, computed, onErrorCaptured, defineAsyncComponent} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging"
import {md} from "./Markdown.mjs"

import CodeItem from "../core/sfc/code-item.vue"

import {
  replaceHrefLinks,
  replaceImgLinks,
  replaceVueSpecial,
  removeMarkdownHeader,
  slugify,
  decorateTableHTML
} from "./MarkdownUtils.mjs";

const props = defineProps({
  v: {
    type: String,
    default: "## Empty v directive"
  },
  adjustHrefPath: Function,
  fetchImage: Function,
  fetchText: {
    type: Function,
    default: async (url) => `${url} text`
  }
})

const emit = defineEmits(['href'])

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'xmarkdown.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("INIT")

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  markdownComponent: null,
  images: null,
})

// ______________________________________________________________________________________
// RENDING VUE COMPONENT
// ______________________________________________________________________________________
async function fetchAllImages() {
  const fetchPromises = Object.keys(local.images).map(relativeURL => {
    logger.debug(`fetchImage - ${relativeURL}`)
    return props.fetchImage(relativeURL).then(blobUrl => {
      local.images[relativeURL] = blobUrl
    });
  });
  await Promise.all(fetchPromises);
}

// ______________________________________________________________________________________
// markdown component
// ______________________________________________________________________________________
function renderMarkdown(html) {
  logger.debug("debugHTML")
  logger.debug(html)

  return {
    template: html,
    components: {
      CodeItem,
    },
    data: () => {
      return {
        images: local.images,
      }
    },
    methods: {
      async routeEndpoint(endpoint) {
        await apiMain.routeByEndpoint(endpoint)
      },
      href(path) {
        emit('href', path)
      },
      scrollToAnchor(anchor) {
        // Remove the # from anchor
        let id = anchor.startsWith('#') ? anchor.slice(1) : anchor

        // Normalize the ID using the same slugification as markdown-it-anchor
        // This ensures we find headers even if the markdown link wasn't perfectly formatted
        const normalizedId = slugify(id)

        // Try normalized ID first
        let target = document.getElementById(normalizedId)

        // Fallback: try the original ID in case it was already correct
        if (!target && normalizedId !== id) {
          target = document.getElementById(id)
          logger.debug(`Trying original ID: ${id}`)
        }

        if (target) {
          // Smooth scroll to the element
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })

          // Optional: Update URL hash without triggering router
          // history.replaceState(null, '', `${window.location.pathname}${window.location.search}${anchor}`)

          logger.debug(`Scrolled to anchor: ${anchor} (normalized: ${normalizedId})`)
        } else {
          logger.warn(`Anchor target not found: ${anchor} (tried IDs: ${normalizedId}, ${id})`)
        }
      }
    },
    mounted() {
      fetchAllImages()
    }
  }
}

// ______________________________________________________________________________________
// MAIN - each time markdown text form prop.v changes we re-build vue component
// ______________________________________________________________________________________
watch(() => props.v, (val) => {
  if(val !== null && val !== "") {
    buildComponent(val)
  }
})

async function buildComponent(markdownText) {
  logger.trace("markdown original text")
  logger.trace(markdownText)

  let markdown =  removeMarkdownHeader(markdownText)
  logger.trace("markdown after injection")
  logger.trace(markdown)

  let html = md.render(markdown)
  html = `<div>${html}</div>`
  html = replaceVueSpecial(html)
  html = replaceHrefLinks(html, props.adjustHrefPath)
  html = decorateTableHTML(html)
  local.images = {}
  html = replaceImgLinks(html, local.images)
  console.log("images")
  console.log(local.images)

  local.markdownComponent = markRaw(renderMarkdown(html))
}


// ______________________________________________________________________________________
// INIT
// ______________________________________________________________________________________

onMounted(() => {
  logger.debug(`init`)
  buildComponent(props.v)
})

onErrorCaptured((err, instance, info) => {
  logger.warn("onErrorCaptured")
  console.log(instance)
  console.log(info)
  console.log(err)
  return false; // prevents the error from propagating further
})
</script>

<template>
  <div class="xmarkdown" v-if="local.markdownComponent !== null">
    <component :is=local.markdownComponent ></component>
  </div>
</template>


<style scoped>
/* xmarkdown.vue */
.xmarkdown {
  //width: 100%;
  //overflow-x: auto;  /* Enable horizontal scrolling for wide content */
  //min-width: 0;      /* Allow shrinking in flex context */
}

</style>
