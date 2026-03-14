<script setup>
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import { reactive, markRaw, watch, watchEffect, onMounted, computed, ref, version } from 'vue'
import { store } from 'GlobalStore'
import { store as notifyStore, api as notifyApi } from 'NotifyUtils'

// TODO: Make longer if only message, shorter if other messages in queue
const ACTIVE_TIME_MS = 5500
const REST_TIME_MS = 250
let delayPromise = null

function delay(ms) {
  let timeoutId;
  let cancelFn;

  const promise = new Promise((resolve) => {
    cancelFn = () => {
      clearTimeout(timeoutId);
      resolve();
    };
    timeoutId = setTimeout(resolve, ms);
  });

  // Attach a cancel method to the promise
  promise.cancel = cancelFn;

  delayPromise = promise;
  return promise;
}

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  consumerRunning: false,
  toast: null,
  notify: {
    message: "default message",
    title: "default title",
    subtitle: "default title",
    type: "INFO",
  }
})


watch(
  () => notifyStore.notifyQueue,
  (curr, prev) => {
    processQueue()
  },
  { deep: true }
)

const notifyClass = computed(() => {
  if (local.notify.type === "GOOD") {
    return "bg-success text-white";
  }
  if (local.notify.type === "BAD") {
    return "bg-warning text-black";
  }
  if (local.notify.type === "INFO") {
    return "bg-primary text-white";
  }
  return "notify-neutral";
})

const itemRef = ref(null)

// ________________________________________________________________________________
// EVENT
// ________________________________________________________________________________
async function processQueue() {
  if (local.consumerRunning) return
  local.consumerRunning = true
  while (notifyStore.notifyQueue.length > 0) {
    const obj = notifyStore.notifyQueue.shift()
    await showMessage(obj)
  }
  local.consumerRunning = false
}

async function showMessage(notify) {
  notifyApi.log(notify)
  local.notify.message = notify.message
  local.notify.type = notify.type
  local.notify.title = notify.title
  local.notify.subtitle = `length=${notifyStore.notifyQueue.length}`
  showToast()
  await delay(ACTIVE_TIME_MS)
  hideToast()
  await delay(REST_TIME_MS)
  delayPromise = null
}

function showToast() {
  local.toast.show()
}

function hideToast() {
  if (delayPromise != null) {
    delayPromise.cancel()
  }
  local.toast.hide()
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  local.toast = markRaw(new bootstrap.Toast(itemRef.value))
}

onMounted(async () => { await init() })
</script>


<template>

  <div aria-live="polite" aria-atomic="true" class="outline-b position-relative w-100" style="z-index: 1031">
    <div class="outline-x  w-50 toast-container position-fixed top-0 start-50  p-2">
      <!-- Then put toasts within -->
      <div ref="itemRef" class="toast w-100" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header" :class="notifyClass">
          <strong class="me-auto ">{{ local.notify.title }}</strong>
          <strong class="">{{ local.notify.subtitle }}</strong>
          <button type="button" @click="hideToast" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" >{{ local.notify.message }} </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.toast {

}

/** NOTIFY */
.outline-x {
  /* border: 3px solid red; */
}

.outline-b {
  /* border: 3px solid green; */
}
</style>
