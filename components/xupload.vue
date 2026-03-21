<script setup>
/*
  xupload.vue

  Usage:
    <x-upload type="text" :callback="handleSelectedFile"/>
  Emits:
    callback(files)
  Props:
    type: "IMAGE", "AUDIO", "VIDEO"
    progress: Number (0-100)
*/
import {ref, reactive, computed, watch, onMounted, onUnmounted} from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "IMAGE"
  }
})


// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  isLoading: false,
  src: null,
  file: null
})

const fileInput = ref();
const files = ref();

const emit = defineEmits(['callback'])

const typeObj = computed(() => {
  const type = props.type.trim().toUpperCase()
  switch (type) {
    case 'IMAGE':
    case 'AUDIO':
    case 'VIDEO':
      return { type, allowUpload: true, accept: `${type.toLowerCase()}/*` }
    case 'TEXT':
      return { type, allowUpload: true, accept: 'text/plain' }
    case 'JSON':
      return { type, allowUpload: true, accept: 'application/json' }
    default:
      return { type, allowUpload: false, accept: '*/*' }
  }
})

watch(() => props.type, () => {
  local.src = null
  local.file = files.value = null
  if (fileInput.value) fileInput.value.value = ''
})


function handleFileChange(event) {
  const selectedFiles = event.target.files
  if (!selectedFiles || selectedFiles.length === 0) {
    files.value = null
    local.src = null
    local.file = null
    return
  }

  files.value = selectedFiles
  local.file = selectedFiles[0]

  const reader = new FileReader()
  reader.onload = (e) => {
    local.src = e.target.result
  }

  const type = typeObj.value.type
  if (type === 'TEXT' || type === 'JSON') {
    reader.readAsText(local.file)
  } else {
    reader.readAsDataURL(local.file)
  }
}
function clearFile() {
  files.value = null
  local.src = null
  local.file = null
  if (fileInput.value) fileInput.value.value = ''
}

function uploadSelectedFiles() {
  // Note: getting absolute filepath is not possible in browser for security reasons
  //  so we return the file object and content
  emit('callback', { file: local.file, content: local.src })
}

</script>


<template>
  <div class="x-component x-upload">

    <div class="row align-items-center">
      <div class="col">
        <input ref="fileInput" @change="handleFileChange" class="form-control" type="file" :accept="typeObj.accept" multiple>
      </div>
      <div class="col-auto">
        <button class="btn btn-sm btn-primary" @click="clearFile" >
          Clear
        </button>
      </div>
    </div>

    <div v-if="files" class="progress mt-2" role="progressbar" aria-label="Success example" :aria-valuenow="props.progress" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-bar bg-success" :style="`width: ${Math.max(props.progress, 1)}%`">{{(props.progress >= 100) ? 'DONE' : props.progress}}</div>
    </div>

    <div class="mt-1">
      <button class="btn btn-sm btn-primary w-100" @click="uploadSelectedFiles" :disabled="!files || files.length === 0">
        Upload
      </button>
    </div>

    <div v-if="typeObj.type === 'IMAGE' && local.src" class="image-preview mt-2">
      <img :src="local.src"  class="img-thumbnail"/>
    </div>
    <div v-if="typeObj.type === 'AUDIO' && local.src" class="mt-2">
      <audio :src="local.src" controls class="w-100"></audio>
    </div>
    <div v-if="typeObj.type === 'VIDEO' && local.src" class="mt-2" >
      <video :src="local.src" controls class="w-100"></video>
    </div>
    <div v-if="typeObj.type === 'TEXT' && local.src" class="mt-2" >
      <textarea type="text" class="form-control" :value="local.src" rows="15" readonly></textarea>
    </div>


  </div>
</template>

<style scoped>
/* xupload.vue */
.x-upload {
  border: 1px solid black;
  padding: 10px;
}

</style>
