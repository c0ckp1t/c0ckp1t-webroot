<script setup>
/*
  Main Documentation Page

  Note: This depends on vue-router being configured with
    { path: 'documentation', redirect: '/default/documentation/Introduction.md'},
    { path: 'documentation/:pathMatch(.*)*', location:'core/pages/page-documentation.vue'}

*/
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import { reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {store as storeMain, api as apiMain} from 'GlobalStore'
import { getLogger } from "Logging";

import { DocUtils, extractBasePathFromURL } from '../DocUtils.mjs'
import MdToc from "../sfc/md-toc.vue";
import {substrAfterFirstSlash} from "JsUtils";

const route = useRoute()
const router = useRouter()



const props = defineProps({
  homepage: {
    type: String,
    default: "/Introduction.md"
  },
  remotePathMapping: {
    type: String,
    default: "/docs"
  },
  enableToc: {
    type: Boolean,
    default: false
  }
})

const baseLocalURL = extractBasePathFromURL(route.fullPath)
const docUtils = new DocUtils(baseLocalURL, props.remotePathMapping)

const instanceId = substrAfterFirstSlash(baseLocalURL)
const registry = storeMain.r[instanceId] ?? storeMain.r[storeMain.defaultInstanceId]

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'Documentation.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

//________________________________________________________________________________
// STATE
//________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  isDirty: false,
  updated: null,

  isHTMLVisible: true,
  isEditVisible: false,

  baseLocalURL : baseLocalURL,
  homepage : `${baseLocalURL}${props.homepage}`,
  previousPath :  `${baseLocalURL}${props.homepage}`,
  currentPath : `${baseLocalURL}${props.homepage}`,

  markdownText: "",
  snapshot: "",
  showScrollToTop: false,
  isDev: storeMain.config.isDev,
});



watch( () => route.fullPath, (fullPath) => {
  logger.debug("[WATCH] currentPath", fullPath)
  if(local.currentPath !== fullPath) {
    local.previousPath = local.currentPath
    local.currentPath = fullPath
    href(docUtils.browserPathToDocumentPath((local.currentPath)))
  }
}, { immediate: false, deep: true } )


watch(
  () => local.markdownText,
  (curr, prev) => {
    if (local.snapshot === curr) {
      local.isDirty = false
    } else {
      local.isDirty = true
    }
  },
)

// ________________________________________________________________________________
// MARKDOWN EVENTS
// ________________________________________________________________________________
function adjustHrefPath(documentPath) {
  const remotePathURL = docUtils.documentPathToRemotePath(local.currentPath, documentPath)
  const browserPath = `${local.baseLocalURL}?p=${remotePathURL}`
  logger.debug(`[adjustHrefPath] - ${documentPath} -> ${browserPath}`)
  return browserPath.replace("/documentation/", "/")
}

async function reload() {
  // await docUtils.removeFromCache(local.currentPath, documentURL)
  const documentPath = docUtils.browserPathToDocumentPath(local.currentPath)
  logger.debug("[reload] documentPath=", documentPath)
  await href(documentPath)
}

async function goToHomePage() {
  await router.push(`${local.homepage}`)
}

async function href(documentPath) {
  const browserPath = docUtils.documentPathToBrowserPath(local.currentPath, documentPath)
  const remotePath = docUtils.browserPathToRemotePath(browserPath)
  logger.debug(`[href] \nbrowserPath=${browserPath}\ndocumentPath=${documentPath}\ncurrentPath=${local.currentPath}\nremotePath=${remotePath}`)
  local.markdownText = ""

  const resp = await docUtils.retrieveText(registry, remotePath)
  logger.debug(resp)
  if (resp.isOk) {
    local.updated = new Date().getTime()
    if(local.currentPath !== browserPath) {
      local.previousPath = local.currentPath
      local.currentPath = browserPath
      await router.replace(browserPath)
    }
  }

  // window.scrollTo({ top: 0, behavior: 'smooth' });
  local.snapshot = resp.result
  local.markdownText = resp.result


}

function fetchImage(documentPath) {
  const remotePathURL = docUtils.documentPathToRemotePath(instanceId, local.baseLocalURL, local.currentPath, documentPath);
  logger.info(`[fetchImage]  - documentPath=${documentPath} - remotePath=${remotePathURL}`);

  // default registry case: fetch bytes and convert to Blob URL
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await registry.getBinary(remotePathURL);
      logger.debug(resp);

      if (!resp.isOk) {
        reject(resp.result);
        return;
      }

      resolve(URL.createObjectURL(new Blob([resp.result])));
    } catch (e) {
      reject(e);
    }
  });
}



// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (storeMain.isReady && local.updated === null) {

    const documentPath = docUtils.browserPathToDocumentPath(route.fullPath)
    await href(documentPath)
  } else {
    setTimeout(() => { init() }, 500)
  }

}

onMounted(() => {
  init()
})



</script>

<template>
  <div class="container">

<!--        {{router}}-->
    <!--    <hr>-->
<!--    baseLocalURL {{ local.baseLocalURL }} <br>-->
<!--        current {{ local.currentPath }} <br>-->
<!--        previous {{ local.previousPath }} <br>-->
<!--        home {{ local.homepage }} <br>-->


    <div class="row text-center mb-22" v-if="storeMain.showDocPath">
      <span class="fw-bold m-1">Current: <span>{{ local.currentPath }}</span> </span>
    </div>

    <div class="row markdown-header align-items-center" v-if="storeMain.showDocReload">
      <div class="col-auto">
        <button class="btn btn-primary" @click="goToHomePage()" :title="local.homepage">
          <i class="fa-solid fa-house"></i> Home Page
        </button>
      </div>

      <div class="col"></div>

      <div class="col-auto">
        <ExecButton icon="fa-arrow-left me-1" :callback="() => router.push(`${local.previousPath}`)"
          v-if="local.currentPath !== local.previousPath">
          {{ local.previousPath }}
        </ExecButton>
      </div>
      <div class="col-auto" v-if="local.isDev">
        <ExecButton icon="fa-rotate-right" :callback="() => reload()">Reload</ExecButton>
      </div>
      <div class="col-auto" v-if="false">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="remoteWork" v-model="local.isHTMLVisible">
          <label class="form-check-label" for="remoteWork">HTML</label>
        </div>
      </div>

    </div>

    <div class="row mt-4">
      <div class="col order-last order-lg-first">
        <div class="row markdown-body mb-4">
          <div class="col" v-if="local.isHTMLVisible">
            <x-markdown :fetchImage="fetchImage" @href="href" :adjustHrefPath="adjustHrefPath"
              :v="local.markdownText"></x-markdown>
          </div>
          <div v-if="false">
            <pre class="md-code mt-4">{{local.markdownText}}</pre>
          </div>
        </div>
      </div>
      <div class="col-auto order-first order-lg-last" v-if="props.enableToc">
        <MdToc :v="local.markdownText" :maxLevel="2" />
      </div>

    </div>


  </div>
</template>

<style scoped>
.md-code {
  padding: 1rem;
  border: 1px solid var(--bs-secondary);
  border-radius: 0.5rem;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>