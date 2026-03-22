<script setup>
/*
  [VARS] - name, init, imports, template, script, style

  Usage:
    const PageXXXX = defineAsyncComponent(() => import("/v3/workflows/c0ckp1t/www/pages/page-homepage.vue"))
    <page-xxxx></page-xxxx>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, ref, onMounted, onUnmounted, defineAsyncComponent, watch} from 'vue'
import {getLogger} from "Logging";
// !# C0CKP1T_START imports
import ComponentView from "./component-view.vue";
import {store as storeMain} from "GlobalStore";
// !# C0CKP1T_END imports

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "frontend/ComponentsAdv.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// !# C0CKP1T_START script
// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  updated: Date.now(),
  pathPrefix: storeMain.config?.componentPrefix ?? "",
  defaultExpand: storeMain.config?.componentsDefaultExpand ?? false,

  tree: [
    {
      label: "src",
      path: "/src",
      isDirectory: true,
      expanded: true,
      children: [
        {
          label: "components",
          path: "/src/components",
          isDirectory: true,
          expanded: true,
          children: [
            { label: "xtree.vue", path: "/src/components/xtree.vue", isDirectory: false, expanded: false, children: [] },
            { label: "xbutton.vue", path: "/src/components/xbutton.vue", isDirectory: false, expanded: false, children: [] },
            { label: "xcard.vue", path: "/src/components/xcard.vue", isDirectory: false, expanded: false, children: [] },
            { label: "xinput.vue", path: "/src/components/xinput.vue", isDirectory: false, expanded: false, children: [] },
          ]
        },
        {
          label: "pages",
          path: "/src/pages",
          isDirectory: true,
          expanded: false,
          children: [
            {
              label: "demo",
              path: "/src/pages/demo",
              isDirectory: true,
              expanded: false,
              children: [
                { label: "page-components.vue", path: "/src/pages/demo/page-components.vue", isDirectory: false, expanded: false, children: [] },
                { label: "page-components-adv.vue", path: "/src/pages/demo/page-components-adv.vue", isDirectory: false, expanded: false, children: [] },
              ]
            },
            { label: "Main.vue", path: "/src/pages/Main.vue", isDirectory: false, expanded: false, children: [] },
            { label: "About.vue", path: "/src/pages/About.vue", isDirectory: false, expanded: false, children: [] },
          ]
        },
        {
          label: "core",
          path: "/src/core",
          isDirectory: true,
          expanded: false,
          children: [
            { label: "Logging.mjs", path: "/src/core/Logging.mjs", isDirectory: false, expanded: false, children: [] },
            { label: "JsUtils.mjs", path: "/src/core/JsUtils.mjs", isDirectory: false, expanded: false, children: [] },
          ]
        },
        { label: "App.vue", path: "/src/App.vue", isDirectory: false, expanded: false, children: [] },
        { label: "main.mjs", path: "/src/main.mjs", isDirectory: false, expanded: false, children: [] },
        { label: "router.mjs", path: "/src/router.mjs", isDirectory: false, expanded: false, children: [] },
      ]
    },
    {
      label: "public",
      path: "/public",
      isDirectory: true,
      expanded: false,
      children: [
        {
          label: "css",
          path: "/public/css",
          isDirectory: true,
          expanded: false,
          children: [
            { label: "bootstrap.min.css", path: "/public/css/bootstrap.min.css", isDirectory: false, expanded: false, children: [] },
          ]
        },
        { label: "favicon.ico", path: "/public/favicon.ico", isDirectory: false, expanded: false, children: [] },
      ]
    },
    {
      label: "node_modules",
      path: "/node_modules",
      isDirectory: true,
      expanded: false,
      children: []
    }
  ],
  treeEmpty: [],
  selectedItem: null,
  textOrMarkdown: false,
  markdownText: `
# H1 Header

## H2 Header

### H3 Header

#### H4 Header

##### H5 Header

###### H6 Header

####### H7 Header (Not Supported)

> This is Quote


Star bullets:
* text 1
    * subtext 1
* text 2
* text 3

Dash bullets:
- text 1
    - subtext 1
- text 2
- text 3

Numbered text:
1. First item
    * Subitem 1
    * Subitem 2
2. Second item


Task List (Checkboxes):
- [ ] To do
- [x] Done

Horizontal Rules
___
---
***



Some random text

~~Strikethrought text~~

Text with double star: **bold**

Text with single star: *italic*

Text with double underscore: __bold__

Text with single underscore: _italic_

Use the \`printf()\` function.

\`\`\`python
def hello_world():
    print("Hello, world!")
\`\`\`

col 1 | col 2 | col 3
------|-------|------
 val1 | val2  | val3
 val4 | val5  | val6


URLs automatically converted to links: \\
https://www.sorsha.com \\
www.sorsha.com \\
sorsha.com

`.trim(),

  myTextEditor: "",
})

function onTreeSelect(item) {
  local.selectedItem = item
  logger.debug(`[onTreeSelect] - ${item.path}`)
}

async function delay() {
  await new Promise(r => setTimeout(r, 1000))
}



// !# C0CKP1T_END script

</script>

<template>
  <!--  !# C0CKP1T_START template -->
  <x-section :level="2" k="Components Advanced">

    <ComponentView name="x-upload"  :url="`${local.pathPrefix}/components/xupload.vue`" :defaultExpand="local.defaultExpand">
      <x-upload>Hello Title</x-upload>
      <x-upload type="TEXT">Hello Title</x-upload>
    </ComponentView>

    <ComponentView name="x-tree"  :url="`${local.pathPrefix}/components/xtree.vue`" :defaultExpand="local.defaultExpand">
      <div class="row">
        <div class="col-md-6">
          <h6>File Tree (with nested folders)</h6>
          <x-tree :items="local.tree" @select="onTreeSelect"></x-tree>
        </div>
        <div class="col-md-6">
          <h6>Empty Tree</h6>
          <x-tree :items="local.treeEmpty"></x-tree>
          <div class="mt-3" v-if="local.selectedItem">
            <h6>Selected Item</h6>
            <code>{{ local.selectedItem.path }}</code>
            <span class="ms-2 badge" :class="local.selectedItem.isDirectory ? 'bg-warning' : 'bg-info'">
              {{ local.selectedItem.isDirectory ? 'Directory' : 'File' }}
            </span>
          </div>
        </div>
      </div>
    </ComponentView>


    <ComponentView name="v-ace-editor"  :url="`${local.pathPrefix}/components/vue3-ace-editor.vue`" :defaultExpand="local.defaultExpand">
        <v-ace-editor height="400px" :fontSize="17" v-model="local.myTextEditor" lang="kotlin" theme="twilight" debug/>
    </ComponentView>

    <ComponentView name="x-terminal"  :url="`${local.pathPrefix}/components/xterminal.vue`" :defaultExpand="local.defaultExpand">
      <XTerminal height="400px" :fontSize="17" v-model="local.myTextEditor" theme="twilight" />
    </ComponentView>

    <ComponentView name="code-mirror"  :url="`${local.pathPrefix}/components/code-mirror.vue`" :defaultExpand="local.defaultExpand">
      <code-mirror
          v-model="local.myTextEditor"
          lang="javascript"
          theme="oneDark"
          height="500px"
          :debug="true"
      />
    </ComponentView>

    <ComponentView name="x-sound"  :url="`${local.pathPrefix}/components/xsound.vue`" :defaultExpand="local.defaultExpand">
      <XSound
          url="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.2/core/img/state-uniqueId-8k.wav"
          id="stateId" :autoLoad="true"/>
    </ComponentView>

    <ComponentView name="x-code"  :url="`${local.pathPrefix}/components/xcode.vue`" :defaultExpand="local.defaultExpand">
      <x-code lang="javascript"  url="https://raw.githubusercontent.com/c0ckp1t/c0ckp1t-webroot/refs/heads/main/docs/Introduction.md" />
    </ComponentView>

    <ComponentView name="x-code-slot"  :url="`${local.pathPrefix}/components/xcode-slot.vue`" :defaultExpand="local.defaultExpand">
      <x-code-slot lang="javascript" title="Random JS Code" :code="`function helloWorld() {\n  console.log('Hello, world!');\n}`" />
    </ComponentView>

    <ComponentView name="x-markdown"  :url="`${local.pathPrefix}/components/xmarkdown.vue`" :defaultExpand="local.defaultExpand">
      <div class="row mb-2">
        <div class="col-auto">
          <x-toggle k="Toggle Between Markdown And Text" v-model="local.textOrMarkdown"></x-toggle>
        </div>
      </div>

      <div class="markdown-code" v-if="local.textOrMarkdown">
        <x-markdown :v="local.markdownText" :fetchImage="() => {}" :href="() => {}" :adjustHrefPath="() => {}" />
      </div>

      <textarea class="form-control markdown-text"
                rows="40"
                v-model="local.markdownText" v-else
      />

    </ComponentView>

  </x-section>
  <!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */
.markdown-code {
  border: 1px solid var(--bs-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
}

.markdown-text{
  border: 1px solid var(--bs-primary);
  border-radius: 0.5rem;
  padding: 1rem;
  width: 100%;
}

/* !# C0CKP1T_END style */
</style>

