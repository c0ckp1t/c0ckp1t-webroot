<script setup>
/*
     components/fs-tree.vue
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import {store as storeMain, api as apiMain} from '@/GlobalStore.mjs'
import {api as notify} from "@/core/notify/NotifyUtils.mjs"
import {getLogger} from "@/core/Logging.mjs";

// import {api as nodeApi, store as nodeStore} from "/c0ckp1t/actions/node/NodeUtils.mjs";
// import {fsApi} from './fs.mjs';
// import {api as fileApi} from './file.mjs';
import {Tree, buildNode, cleanAbsPath, lastKey, pathToKeyArr, extractSymbolicLinkTarget} from '@/core/Tree.mjs';
// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'components/fs-tree.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("init")

// ________________________________________________________________________________
// PROPERTIES
// ________________________________________________________________________________
const props = defineProps({
  nodeId: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: String,
    default: "/"
  },
  path: {
    type: String,
    default: "/"
  },
  exec: {
    type: Function,
    required: true
  }
})

const isOnline = computed( () => {
  // if(!nodeStore.entities.hasOwnProperty(props.nodeId)) { return false }
  // if(nodeStore.entities[props.nodeId].status === null) { return false }
  // return nodeStore.entities[props.nodeId].status.isConfirmed
  return false
})

const emit = defineEmits(['update:modelValue'])
const v = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
});

function select(item) {
//   console.log(`[${id}] - selected - ${item.id}`)
//   if(v.value === item.path) {
//     v.value = null
//   } else {
  v.value = item.path
  // }
  // emit('path', item.path)
  // v.value = item.path
}


// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  isVisible: true,
  isDirty: false,

  selectedNode: null,
  hostname: "",
  workingDir: "",
  tree: null,

  createFileNameText: "",

  catStdout: "",
  snapshot: "",
  fileStdout: "",

})

watch(
    () => props.nodeId,
    (curr, prev) => {
      init()
    }
)

watch(
  () => local.catStdout,
  (curr, prev) => {
    if (JSON.stringify(local.snapshot) === JSON.stringify(curr)) {
      local.isDirty = false
    } else if (local.selectedNode !== null && !local.selectedNode.isDirectory) {
      local.isDirty = true
    }
  },
  {deep: true}
)

const fileStdoutModified = computed(() => {
  // return local.fileStdout.replace(`${local.workingDir}`, "").replace(":", "")
  return local.fileStdout.split(":")[1]
})

const fileAbsPath = computed(() => {
  if (local.selectedNode == null) return "N/A"
  if (local.selectedNode.key == local.workingDir) return local.workingDir
  return `${local.workingDir}${local.selectedNode.key}`
})

// ________________________________________________________________________________
// API METHODS
// ________________________________________________________________________________
async function hostname() {
    const resp = await props.exec("/wf/1", ["hostname", props.nodeId.toString()])
    logger.debug(resp)
    local.hostname = resp.result
    return resp
}

async function file(absPath) {
    const resp = await props.exec("/wf/1", ["file", props.nodeId.toString(), absPath])
    logger.debug(resp)
    return resp.result
}

async function du() {
    const fileName = local.selectedNode.path
    const resp = await props.exec("/wf/1", ["du", props.nodeId.toString(), fileName])
    // resut is in kilobytes
    const message = resp.result
    // console.log(message)
}

async function targz() {
    const absPath = cleanAbsPath(local.workingDir)
    // console.log(absPath)
    const baseName = absPath.split('/').pop().replaceAll('.', "").replaceAll(' ', "_")
    if (baseName == "") {
      throw `[Error] - name=${name} is not a valid name`
    }
    const name = `${baseName}-${Date.now()}`
    // console.log(name)
    const resp = await props.exec("/wf/1", ["compress", props.nodeId.toString(), absPath, name])
    const message = resp.result
    // console.log(result)
}


// ________________________________________________________________________________
// LS BUILD TREE
// ________________________________________________________________________________
// Remove variations of path with trailing '/' or no trailing '/'


async function ls(node) {
    if (node === null) {
      node = local.selectedNode
    }
    logger.debug(`ls() - ${node.key} - ${node.path}`)

    local.fileStdout = await file(node.path)
    // [EXECUTE_ERROR] - file  '/opt/c0ckp1t/content' returned error: /bin/bash: line 1: file: command not found
    if (!local.fileStdout.includes("directory")) {
      notify.badDetails(`[${local.id}] - path specified is not a directory`, `await file() inside await ls()`)
      logger.debug(local.fileStdout)
      return
    }
    if (local.fileStdout.includes("cannot")) {
      notify.badDetails(`[${local.id}] - path specified has an issue with "await file()`, `${local.fileStdout}`)
      return
    }

    const resp = await props.exec("/wf/1", ["ls", props.nodeId.toString(), node.path])
    logger.debug(resp)
    if(!resp.isOk) {
      notify.badDetails(`[${local.id}] - path specified has an issue`, `Possibly permission denied or can't parse. message=${resp.message}`)
      return
    }

    // console.log(resp)
    const message = JSON.parse(resp.result)

    const metadata = message
      .filter(item => {
        return item.name === "."
      }).map(item => item)[0]

    node.metadata = metadata

    message.filter(item => {
      return item.name !== "." && item.name !== ".."
    })
      .forEach(item => {
        const key = item.name
        const newNode = buildNode(key, item.name, null, item, item.isDirectory)
        local.tree.insertByParent(node, newNode)
      })

}


function isValidFile(callLocation) {
  if (local.selectedNode === null) {
    notify.badDetails(`[${local.id}] - ${callLocation} failed`, `No tree node has been selected`)
    return false
  }
  if (local.selectedNode.isDirectory) {
    notify.badDetails(`[${local.id}] - ${callLocation} failed`, `Path is a directory but expected file : ${local.selectedNode.path}`)
    return false
  }
  return true
}

// ________________________________________________________________________________
// File API
// ________________________________________________________________________________
async function readFile() {
  if (!isValidFile("readFile")) return
  local.catStdout = ""
  const fileName = local.selectedNode.path
  // console.log(`[${local.id}] - reading file - ${fileName}`)
  local.isLoading = true
  try {
    const resp = await props.exec("/wf/1", ["fileRead2", props.nodeId.toString(), fileName])
    // console.log(resp)
    if (!resp.isOk) {
      notify.badDetails(`[${local.id}] - readFile failed`, `${resp.result}`)
      return
    }
    local.snapshot = resp.result
    local.catStdout = resp.result
  } finally {
    local.isLoading = false
  }
}

async function saveFile() {
  if (!isValidFile("saveFile")) return
  const currentNode = local.selectedNode
  const fileName = local.selectedNode.path
  const fileText = local.catStdout
  local.isLoading = true
  try {
    const resp = await props.exec("/wf/1", ["fileWrite2", props.nodeId.toString(), fileName, fileText])
    if (!resp.isOk) {
      notify.badDetails(`[${local.id}] - saveFile failed`, `${JSON.stringify(resp)}`)
    } else {
      notify.goodDetails(`[${local.id}] - saveFile success`, `${JSON.stringify(resp)}`)
    }
    ls(local.selectedNode.parent)
    selectTreeNode(currentNode)
  } finally {
    local.isLoading = false
  }
}


async function deleteNode() {
  if (local.selectedNode.isDirectory) {
    deleteDir()
  } else {
    deleteFile()
  }
}

async function deleteFile() {
  if (!isValidFile("deleteFile")) return
  local.snapshot = ""
  local.catStdout = ""
  const fileName = local.selectedNode.path
  local.isLoading = true
  try {
    const resp = await props.exec("/wf/1", ["fileRemove", props.nodeId.toString(), fileName])
    if (!resp.isOk) {
      notify.badDetails(`[${local.id}] - deleteFile failed`, `${resp.result}`)
      return
    }
    const parent = local.selectedNode.parent
    local.tree.deleteNode(local.selectedNode)
    selectTreeNode(parent)
  } finally {
    local.isLoading = false
  }
}

async function deleteDir() {
  if (!local.selectedNode.isDirectory) {
    notify.badDetails(`[${local.id}] - deleteDir failed`, `Path is not a directory: ${local.selectedNode.path}`)
    return false
  }
  local.catStdout = ""
  local.snapshot = ""
  const fileName = local.selectedNode.path
  local.isLoading = true
  try {
    const resp = await props.exec("/wf/1", ["dirRemove", props.nodeId.toString(), fileName])
    if (!resp.isOk) {
      notify.badDetails(`[${local.id}] - removeDir failed`, `${resp.result}`)
      return
    }
    const parent = local.selectedNode.parent
    local.tree.deleteNode(local.selectedNode)
    selectTreeNode(parent)
  } finally {
    local.isLoading = false
  }
}

async function createFile() {
  local.catStdout = ""
  local.snapshot = ""
  const fileName = `${local.selectedNode.path}/${local.createFileNameText}`;
  const defeaultText = "fs-simple created this file"
  local.isLoading = true
  try {
    const resp = await props.exec("/wf/1", ["fileWrite2", props.nodeId.toString(), fileName, defeaultText])
    if (!resp.isOk) {
      notify.badDetails(`[${local.id}] - createFile failed`, `${resp.result}`)
      return
    }
    ls(local.selectedNode)
  } finally {
    local.isLoading = false
  }
}

async function createDir() {
  local.catStdout = ""
  local.snapshot = ""
  const fileName = `${local.selectedNode.path}/${local.createFileNameText}`;
  local.isLoading = true
  try {
    const resp = await props.exec("/wf/1", ["dirCreate", props.nodeId.toString(), fileName])
    if (!resp.isOk) {
      notify.badDetails(`[${local.id}] - createFile failed`, `${resp.result}`)
      return
    }
    ls(local.selectedNode)
  } finally {
    local.isLoading = false
  }
}

async function rename() {
  const parent = local.selectedNode.parent;
  const src = `${local.selectedNode.path}`;
  const dst = `${parent.path}/${local.createFileNameText}`;
  local.isLoading = true
  try {
    const resp = await props.exec("/wf/1", ["move", props.nodeId.toString(), src, dst])
    if (!resp.isOk) {
      notify.badDetails(`[${local.id}] - rename failed`, `${resp.result}`)
      return
    }
    local.tree.deleteNode(local.selectedNode)
    ls(parent)
  } finally {
    local.isLoading = false
  }
}

// ________________________________________________________________________________
// EVENTS
// ________________________________________________________________________________
async function selectTreeNode(node) {
  local.selectedNode = node
  // console.log(node)
  local.fileStdout = await file(`${node.path}`)
  // console.log(local.fileStdout)
  // console.log(node)
  if (node.isDirectory && node.children.length === 0) {
    // console.log(`shuld auto laod ${node.path}`)
    await ls(node)
    local.catStdout = ""
    node.expanded = true
  } else if (local.fileStdout.includes("empty")) {
    local.catStdout = ""
    local.snapshot = ""
  } else if (local.fileStdout.includes("text") || local.fileStdout.includes("JSON")
    || local.fileStdout.includes("PEM") || local.fileStdout.includes("key")
  ) {
    await readFile()
  }
  // emit('selected', node)
  select(node)
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (storeMain.isReady) {
    const resp = await hostname()
    if (!resp.isOk) {
      local.hostname = `[ERROR] - node is not connected - ${resp.result}`
      local.selectedNode =  null
      return
    }

    let inputPath = props.path

    const fileType = await file(inputPath)
    if(fileType.includes("symbolic link to")) {
      logger.debug("warning symbolic link")
      inputPath = extractSymbolicLinkTarget(fileType)
    }

    local.workingDir = cleanAbsPath(inputPath)
    logger.info(`workingDir - ${local.workingDir}`)
    // const key = lastKey(local.workingDir)
    local.tree = new Tree("", local.workingDir, "./")
    local.selectedNode = local.tree.root[0]
    ls(local.selectedNode)
    // emit('selected', local.selectedNode)
    select(local.selectedNode)
  } else {
    setTimeout(async () => { await init() }, 1000)
  }

}

onMounted(async () => {
  init()
})
defineExpose({init})

</script>


<template>
  <div class="file-tree">
    <div class="row mt-1 mb-2">

      <div class="col-auto" >
        <x-label k="nodeId: ">{{ props.nodeId }} <i class="fa-solid fa-ethernet ms-2" :class="{'is-online': isOnline, 'is-offline': !isOnline}"></i> </x-label>
      </div>
      <div class="col-auto">
        <x-label k="hostname: ">{{ local.hostname }}</x-label>
      </div>
    </div>

    <div class="row mt-2">

      <div class="col selected-node" v-if="local.selectedNode">
        <div class="row file-permissions">
          <div class="col pt-2" v-if="local.selectedNode !== null">
            <div class="metadata" v-if="local.selectedNode.metadata !== null">
              <i class="fa-solid me-1 fa-folder" v-if="local.selectedNode.isDirectory"></i>
              <i class="fa-solid me-1 fa-file" v-if="!local.selectedNode.isDirectory"></i>
              <i class="fa-solid fa-link" v-if="false"></i>
              <i class="fa-solid fa-file-lines" v-if="false"></i>
              <i class="fa-solid fa-file-image" v-if="false"></i>
              <span class="ps-2 pe-2 ">{{ local.selectedNode.metadata.lastModified }}</span>
              <span class="ps-2 pe-2">{{ local.selectedNode.metadata.permissions }}</span>
              <span class="ps-2 pe-2">{{ local.selectedNode.metadata.numberOfLinks }}</span>
              <span class="ps-2 pe-2">{{ local.selectedNode.metadata.owner }}</span>
              <span class="ps-2 pe-2">{{ local.selectedNode.metadata.group }}</span>
              <span class="ps-2 pe-2">{{ local.selectedNode.metadata.numberOfBytes }}</span>
              <span class="ps-2 pe-2 fw-bold">{{ local.selectedNode.path }}</span>
            </div>
          </div>
        </div>

        <div class="row file-info mt-2">
          <div class="col-auto">
            <x-input k="Name" v-model="local.createFileNameText"></x-input>
          </div>
          <div class="col" v-if="local.selectedNode != null">
            <x-button :class="{'btn-dark': local.createFileNameText == '' }" :disabled="local.createFileNameText == ''"
                      @callback="rename"
                      :isLoading="local.isLoading" icon="fa-arrow-left" class="me-1" extras="btn-primary"></x-button>
            <x-button :class="{'btn-dark': local.createFileNameText == '' || !local.selectedNode.isDirectory}"
                      :disabled="local.createFileNameText == '' || !local.selectedNode.isDirectory" @callback="createFile"
                      :isLoading="local.isLoading" icon="fa-file-circle-plus" class="me-1" extras="btn-primary"></x-button>
            <x-button :class="{'btn-dark': local.createFileNameText == '' || !local.selectedNode.isDirectory}"
                      :disabled="local.createFileNameText == '' || !local.selectedNode.isDirectory" @callback="createDir"
                      :isLoading="local.isLoading" icon="fa-folder-plus" class="me-1" extras="btn-primary"></x-button>
          </div>

          <div class="col-auto">
            <x-label class="" k="File Details:">{{ fileStdoutModified }}</x-label>
          </div>
          <div class="col-auto">
            <x-button class="me-1" @callback="readFile" icon="fa-arrows-rotate"></x-button>
            <x-button class="me-1" @callback="saveFile" icon="fa-floppy-disk" :disabled="!local.isDirty"></x-button>
            <x-button class="me-1" @callback="deleteNode" icon="fa-trash"></x-button>
            <x-button class="me-1" @callback="ls(null)" icon="" :disabled="!local.selectedNode.isDirectory">ls
            </x-button>
            <x-button class="me-1" @callback="du" icon="" :disabled="!local.selectedNode.isDirectory">du</x-button>
            <x-button class="me-1" @callback="targz" icon="">tar.gz</x-button>
          </div>
        </div>

        <div class="col-auto" v-if="local.tree !== null">
          <x-tree :items="local.tree.root" @select="selectTreeNode"></x-tree>
        </div>

        <div class="row mt-2 p-1 " :class="{'is-dirty': local.isDirty}">
          <v-ace-editor :fontSize="17" v-model="local.catStdout" lang="sh" theme="twilight"
                        style="height: 800px"></v-ace-editor>
        </div>

      </div>
      <div class="col selected-node" v-else>
        No Tree Node has been selected
      </div>

    </div>

  </div>
</template>


<style scoped>



button {
  min-width: 50px;
}

.selected-node {
  /* border: 1px solid black; */
}

.is-dirty {
  border-left: 4px solid red;

}


.fa-folder {
  color: #FFDB58;
}
</style>
