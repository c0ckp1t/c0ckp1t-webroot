<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'

import { actions, state, connStateString, url, isAuthenticated, tryCallLoading} from "WsInterface";

import {getLogger} from "Logging";
import {store as storeSession} from "Session";

const props = defineProps({
  id: String
})

//________________________________________________________________________________
// Logging
//________________________________________________________________________________
const LOG_HEADER = 'ws-connection.vue'
const logger = getLogger(LOG_HEADER)

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const backoffMsMax = 20000;

const local = reactive({
  isLoading: false,
  isDev: false,

  retries: 0,
  retryEnable: true,
  errorReason: "N/A",

})

var timeoutID = null

// ________________________________________________________________________________
// EVENT METHODS
// ________________________________________________________________________________
async function connectRetry() {
  if (isAuthenticated.value === true) return connStateString.value
  try {
    logger.info("connectRetry")
    await actions.connect()
  } catch(e) {
    local.errorReason = e
    if(local.retryEnable) {
      const delay = Math.min(local.retries * 2000, backoffMsMax)
      local.retries += 1
      timeoutID = setTimeout(() => { connectRetry() }, delay)
    }
  }
}

async function connect() {
  storeSession.actor.send({type: 'c0ckp1t.connect'});
}

async function disconnect() {
  storeSession.actor.send({type: 'c0ckp1t.disconnect'});
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
function init() {
  logger.info("init")
}

onMounted(async () => { init() })

</script>


<template>
<div class="ws-server">

<div class="row mb-3">
  <div class="input-group">
    <span class="input-group-text">Host</span>
    <input type="text" v-model="state.hostname" name="hostname" class="form-control">
  </div>
  <div class="input-group">
    <span class="input-group-text">Port</span>
    <input type="text" v-model="state.port" name="port" class="form-control">
  </div>
  <div class="input-group">
    <span class="input-group-text">Endpoint</span>
    <input type="text" v-model="state.endpoint" name="endpoint" class="form-control">
  </div>
  <div class="input-group">
    <span class="input-group-text">Username</span>
    <input type="text" v-model="state.username" name="username" class="form-control">
  </div>
  <div class="input-group">
    <span class="input-group-text">Password</span>
    <input type="password" v-model="state.password" name="password" class="form-control">
  </div>
</div>

<div class="row mb-3">
  <div class="input-group">
    <span class="input-group-text">URL</span>
    <!-- URL will have to be filled in using JavaScript -->
    <input type="text" v-model="url" readonly class="form-control">
  </div>
  <div class="input-group">
    <span class="input-group-text">Connection State</span>
    <!-- Connection state will also need to be managed with JavaScript -->
    <input type="text" v-model="connStateString" readonly class="form-control" :class="{'bg-success': connStateString === 'ONLINE'}">
  </div>
  <div class="input-group">
    <span class="input-group-text">Session State</span>
    <!-- Connection state will also need to be managed with JavaScript -->
    <input type="text" v-model="storeSession.stateText" readonly class="form-control" >
  </div>
  <span class="" v-if="storeSession.errorMessage !== ''">Error Reason: {{storeSession.errorMessage}}</span>
</div>

<div class="row">
  <div class="btn-group" role="group" aria-label="Basic example">
    <button class="btn btn-primary me-1" @click="connect" :disabled="storeSession.isConnected">Connect</button>
    <button class="btn btn-warning me-1" @click="disconnect" :disabled="!storeSession.isConnected">Disconnect</button>



  </div>
  <span class="">Retry Enabled: {{local.retryEnable}}</span>
  <span class="" v-if="local.retries !== 0">Retries: {{local.retries}}</span>
</div>

</div>

</template>


<style scoped>
.input-group-text {
  min-width:100px;
}

.input-group-text-lg {
  min-width: 150px;
}

</style>
