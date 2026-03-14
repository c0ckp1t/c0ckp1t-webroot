<script setup>
/*
<x-map k="Global KV" v-model="entity.kv"></x-map>
*/

// ________________________________________________________________________________
// IMPORT
// ________________________________________________________________________________
import {computed, onMounted, reactive} from 'vue';

const props = defineProps({
      k: String,
      modelValue: {
        default: () => {
          "N/A"
        }
      },
    }
)

const defaultValue = "default Value"

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  isLoading: false,
  textAddKey: "",
  toggleJSON: false
})

const emit = defineEmits(['update:modelValue'])
const kv = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
});


// ________________________________________________________________________________
// METHODS
// ________________________________________________________________________________
function removeKey(key) {
  // console.log(`remove k=${key}`)
  delete props.modelValue[key]
}

function addKey() {
  // console.log(`adding ${local.textAddKey} = default value`)
  // kv[local.textAddKey] = defaultValue
  props.modelValue[local.textAddKey] = defaultValue
  local.textAddKey = ''
}


// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
}

onMounted(async () => {
  init()
})

</script>


<template>
  <div class="xmap">

    <div class="row menu align-items-center">
      <div class="col-auto">
        <span class="fw-bold text-secondary">{{ props.k }}</span>
      </div>
      <div class="col-auto">
        <x-input k="Add Item" v-model="local.textAddKey"></x-input>
      </div>
      <div class="col-auto">
        <ExecButton icon="fa-circle-plus"  :callback="() => addKey()"
                  :disabled="local.textAddKey === ''"></ExecButton>
      </div>
      <div class="col-auto">
        <x-toggle k="JSON" v-model="local.toggleJSON"></x-toggle>
      </div>
    </div>

    <div class="mt-2 mb-2" v-if="local.toggleJSON">
      <pre class="mt-2 p-2 bg-dark text-white">{{ kv }}</pre>
    </div>

    <!-- KV -->
    <div v-for="(v, k) in kv" class="row">
      <div class="col">
        <x-input :k="k" v-model="kv[k]"></x-input>
      </div>

      <div class="col-auto">
        <ExecButton icon="fa-trash"   :callback=" () => removeKey(k)"
        ></ExecButton>
      </div>
    </div>

  </div>
</template>
