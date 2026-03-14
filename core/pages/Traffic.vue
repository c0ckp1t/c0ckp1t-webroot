<script setup>
/*
    c0ckp1t-wslog.vue
    This is a frontend for WsLogUtils

      START -> FACK 1 ms -> ACK -> LACK 12 ms
      Start always happens at time 0 ms
      FACK 1ms means it took 1ms to get an ACK from c0ckp1t
      LACK 12ms means it took 12ms from start until it completed the flow and sent LACK

      START means REQ or LREQ

*/

//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import { defineAsyncComponent, reactive, watch, onMounted, computed } from 'vue'
import { store as storeMain, api as apiMain} from 'GlobalStore'

import { store as logStore, api as logApi } from './traffic/WsLogUtils.mjs'
const LogWsExec = defineAsyncComponent(() => import("./traffic/log-ws-exec.vue"))
const LogWsExec2 = defineAsyncComponent(() => import("./traffic/log-ws-exec2.vue"))

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  id: `ws-log`,
  isVisibile: {}
})

//________________________________________________________________________________
// HELPERS
//________________________________________________________________________________
function recursiveJsonParse(dto) {
  try {
    //TODO: check value?
    const parsedJson = JSON.parse(dto.message);
    for (let key in parsedJson) {
      if (typeof parsedJson[key] === 'string') {
        parsedJson[key] = recursiveJsonParse(parsedJson[key]);
      }
    }
    return parsedJson;
  } catch (error) {
    return dto;
  }
}

function extractDtoType(dto) {
  try {
    return dto.type
  } catch (error) {
    return "unknown";
  }
}

//________________________________________________________________________________
// EVENT HANDLERS
//________________________________________________________________________________
function clearLogs() {
  console.log(`clear logs not implemented`)
}

function select(index) {
  console.log(`[${local.id}] -select ${index}`)
  const id = index
  if (Object.hasOwn(local.isVisibile, id)) {
    delete local.isVisibile[id]
  } else {
    local.isVisibile[id] = true
  }
}

function clickTable(idx) {

}


</script>


<template>
  <x-section extra="fs-4" :visible="true" k="Websocket Logs">


    <template v-slot:header>
      <ExecButton icon="fa-info" :callback="() => apiMain.selectDocumentation(logStore.documentation)"></ExecButton>
    </template>

      <x-collapse k="logStore">
        <x-json :obj="logStore"></x-json>
      </x-collapse>

      <div class="row mt-2 mb-3">
        <div class="col-auto">
          <x-toggle k="Logging Enabled" v-model="logStore.enabled"></x-toggle>
        </div>
        <div class="col-auto">
          <x-label k="Index"><span class="input-group-text"><a :href="`/#/default/traffic/#jump-${logStore.historyIdx - 1}`">{{ logStore.historyIdx - 1 }}</a></span></x-label>
        </div>
        <div class="col-auto">
          <button class="btn btn-dark" @click="logApi.clearLogs">Clear Logs</button>
        </div>
      </div>

      <x-table-open :exclude="[]" :arr="logStore.history"  @select="clickTable">

        <template v-slot:default="slotProps">
          <div v-if="logStore.history[slotProps.v].type === 'EXEC_REQ'">
            <LogWsExec :v="logStore.history[slotProps.v]"></LogWsExec>
          </div>
          <div v-if="logStore.history[slotProps.v].type === 'EXEC2_REQ'">
            <LogWsExec2 :v="logStore.history[slotProps.v]"></LogWsExec2>
          </div>
          <div v-else>
            {{logStore.history[slotProps.v]}}
          </div>
        </template>

        <template v-slot:index="props0">
          <span :id="`jump-${props0.v}`" :class="{'active' : props0.v == logStore.historyIdx - 1 }"> {{props0.v}}</span>
        </template>

        <template v-slot:in="props1">
          {{props1.v.length}}
        </template>

        <template v-slot:out="props2">
          {{props2.v.length}}
        </template>

      </x-table-open>
      <div v-if="logStore.history.length === 0">
        <h3>No Items</h3>
      </div>

  </x-section>
</template>


  <!-- ________________________________________________________________________________ -->
  <!-- STYLE -->
  <!-- ________________________________________________________________________________ -->
<style scoped>
.active{
  background-color: rgb(250 164 203);
  font-weight: 800;
  font-size: 1.2rem;
}
</style>
