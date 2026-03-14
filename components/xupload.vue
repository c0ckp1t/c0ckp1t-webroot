<script setup>
import {ref, reactive, computed, onMounted, onUnmounted} from 'vue'

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
  updatedMs: null,
  file: null
})

const fileInput = ref();
const files = ref();

const emit = defineEmits(['callback'])

async function handleChange() {
  files.value = fileInput.value.files;
}

async function uploadSelectedFiles() {
  emit("callback", files.value)
}


const typeObj = computed(() => {
  // if you change type src must be reset to null
  local.src = null
  if(props.type === 'IMAGE') {
    return {
      allowUpload: true,
      accept: `${props.type.toLowerCase()}/*`,
    }
  } else if(props.type === 'IMAGE') {
    return {
      allowUpload: true,
      accept: `${props.type.toLowerCase()}/*`,
    }
  } else if(props.type === 'VIDEO') {
    return {
      allowUpload: true,
      accept: `${props.type.toLowerCase()}/*`,
    }
  } else {
    return {
      allowUpload: false,
      accept: `${props.type.toLowerCase()}/*`,
    }
  }
})

function handleImagePreview(event) {
  local.file = event.target.files[0];
  if (!local.file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    local.src = e.target.result;
    local.updatedMs = Date.now();
  };
  reader.readAsDataURL(local.file);
}

</script>


<template>
  <div class="x-component x-upload">

    <div class="row">
      <div class="col">
        <input ref="fileInput" @change="handleImagePreview" class="form-control" type="file" :accept="typeObj.accept" multiple>
      </div>
      <div class="col-auto">
        <button @click="uploadSelectedFiles" :disabled="!files || files.length === 0">Upload</button>
      </div>
    </div>


    <div v-if="props.type === 'IMAGE'" class="image-preview mt-2">
      <img :src="local.src"  class="img-thumbnail"/>
    </div>
    <div v-if="props.type === 'AUDIO'" class="mt-2">
      <audio :src="local.src" controls class="w-100"></audio>
    </div>
    <div v-if="props.type === 'VIDEO'" class="mt-2">
      <video :src="local.src" controls class="w-100"></video>
    </div>



    <div v-if="files" class="progress mt-2" role="progressbar" aria-label="Success example" :aria-valuenow="props.progress" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-bar bg-success" :style="`width: ${Math.max(props.progress, 1)}%`">{{(props.progress >= 100) ? 'DONE' : props.progress}}</div>
    </div>

    <div v-if="local.src" class="image-preview mt-2">
      <img :src="local.src" alt="Preview" class="img-thumbnail"/>
    </div>
    <div v-if="local.src" class="image-preview mt-2">
      <audio :src="local.src" controls class="w-100"></audio>
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
