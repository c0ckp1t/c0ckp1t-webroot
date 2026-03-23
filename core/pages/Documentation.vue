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
import {api as notifyApi} from 'NotifyUtils'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import { getLogger } from "Logging";
import {normalizePath, buildFailedMarkdown} from "JsUtils"

import MdToc from "../sfc/md-toc.vue";

// ________________________________________________________________________________
// PROPERTIES
// ________________________________________________________________________________
const route = useRoute()
const router = useRouter()

const props = defineProps({
  homepage: {
    type: String,
    default: "/Introduction.md"
  },
  /**
   * Used to identify the registry
   */
  instanceId: {
    type: String,
    default: storeMain.defaultInstanceId ?? "default"
  },
  /**
   * This is the base path for vue-router
   * I.e, the documentation page will be at https://domain.com/default/docs/Introduction.md
   *  where /default/docs is the routerPath
   *  Note: includes instanceId
   */
  routerPath: {
    type: String,
    default: "/default/docs"
  },
  /**
   * This is the base path for requesting documents on registry.
   * I.e, on remote server the document might be at https://domain.com/docs/Introduction.md
   *  where /docs is the remotePathMapping
   */
  remotePathMapping: {
    type: String,
    default: "/docs"
  },
  enableToc: {
    type: Boolean,
    default: false
  }
})

const registry = computed(() => {
  return storeMain.r[props.instanceId]
})

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

  currentPath : props.homepage,
  previousPath : props.homepage,

  markdownText: "",
  snapshot: "",
  showScrollToTop: false,
});



watch( () => route.fullPath, (fullPath) => {
  logger.debug("[WATCH] currentPath", fullPath)
  const documentPath = fullPath.replace(props.routerPath, "")
  if(local.currentPath !== documentPath) {
    href(documentPath)
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
  return `${props.remotePathMapping}${documentPath}`
}

async function reload() {
  logger.debug("[reload] local.currentPath=", local.currentPath)
  await href(local.currentPath)
}

async function goToHomePage() {
  await router.push(`${props.routerPath}${props.homepage}`)
}

async function href(documentPath) {
  const remotePath = `${props.remotePathMapping}${normalizePath(documentPath)}`
  logger.debug(`[href] \ndocumentPath=${documentPath}\ncurrentPath=${local.currentPath}\nremotePath=${remotePath}`)
  local.markdownText = ""

  const resp = await registry.value.getText(remotePath)
  logger.debug(resp)
  if (resp.isOk) {
    local.updated = new Date().getTime()
  } else {
    resp.result = buildFailedMarkdown(remotePath, resp.result)
  }
  if(local.currentPath !== documentPath) {
    local.previousPath = local.currentPath
    local.currentPath = normalizePath(documentPath)
    await router.replace(`${props.routerPath}${local.currentPath}`)
  }
  // window.scrollTo({ top: 0, behavior: 'smooth' });
  local.snapshot = resp.result
  local.markdownText = resp.result
}

function fetchImage(documentPath) {
  const remotePath = `${props.remotePathMapping}${normalizePath(documentPath)}`
  logger.debug(`[fetchImage]  - documentPath=${documentPath} - remotePath=${remotePath}`);

  return new Promise(async (resolve, reject) => {
    try {
      const resp = await registry.value.getBinary(remotePath);
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

async function saveMarkdown() {
  const remotePath = `${props.remotePathMapping}${normalizePath(local.currentPath)}`

  logger.debug(`[saveMarkdown] currentPath=${local.currentPath}\nremotePath=${remotePath}`)
  const args = ["write", remotePath, local.markdownText]
    const resp = await registry.value.exec("/sys/resolver", args)
    logger.info(resp)
    if (!resp.isOk) {
      notifyApi.badDetails(`${local.id} - saveMarkdown failed`, resp.result)
      return
    }
    local.snapshot = local.markdownText
    local.isDirty = false
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (storeMain.isReady && local.updated === null) {
    const documentPath = route.fullPath.replace(props.routerPath, "")
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
  <div class="container documentation mt-4">

    <div class="row text-center mb-2" v-if="storeMain.showDocTrail">
      <span class="fw-bold m-1">Current: <span>{{ local.currentPath }}</span> </span>
    </div>

    <div class="row markdown-header align-items-center" v-if="storeMain.showDocNav">
      <div class="col-auto" v-if="local.currentPath !== props.homepage">
        <ExecButton icon="fa-house me-1" class="btn btn-primary btn-sm" :title="props.homepage" :callback="() => goToHomePage()"
                    >
          Home Page
        </ExecButton>
      </div>

      <div class="col"></div>

      <div class="col-auto">
        <ExecButton icon="fa-arrow-left me-1"  class="btn btn-primary btn-sm" :callback="() => router.push(`${props.routerPath}${local.previousPath}`)"
          v-if="local.currentPath !== local.previousPath">
          {{ local.previousPath }}
        </ExecButton>
      </div>
      <div class="col-auto" v-if="storeMain.allowDocWrite">
        <x-toggle k="HTML" v-model="local.isHTMLVisible"></x-toggle>
      </div>
      <div class="col-auto" v-if="storeMain.allowDocWrite">
        <x-toggle k="Markdown" v-model="local.isEditVisible" ></x-toggle>
      </div>
      <div class="col-auto" v-if="storeMain.allowDocReload">
        <ExecButton class="btn btn-primary btn-sm" icon="fa-rotate-right" :callback="() => reload()">Reload</ExecButton>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col order-last order-lg-first">
        <div class="row markdown-body mb-4">

          <div class="col" v-if="local.isHTMLVisible">
            <x-markdown :fetchImage="fetchImage" @href="href" :adjustHrefPath="adjustHrefPath"
              :v="local.markdownText"></x-markdown>
          </div>
          <div class="col" :class="{'is-dirty': local.isDirty}" v-if="local.isEditVisible">

            <ExecButton class="btn btn-primary btn-sm mt-1" icon="fa-floppy-disk"
                        :callback="() => saveMarkdown()"
                        :disabled="!local.isDirty"
                        v-if="registry?.store?.context?.accessLevel <= 500">
            </ExecButton>

            <v-ace-editor v-model="local.markdownText" lang="markdown" theme="twilight"
                          style="height: 800px"></v-ace-editor>
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