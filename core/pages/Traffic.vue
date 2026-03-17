<script setup>
/*
    Traffic.vue
    This is a frontend for WsLogUtils.mjs
*/

//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import { defineAsyncComponent, reactive, watch, onMounted, computed } from 'vue'
import { store as storeMain, api as apiMain} from 'GlobalStore'

import { store as logStore, api as logApi } from 'WsLogUtils'
import ExecButton from "../../components/ExecButton.vue";
const LogWsExec = defineAsyncComponent(() => import("./traffic/log-ws-exec.vue"))
const LogWsExec2 = defineAsyncComponent(() => import("./traffic/log-ws-exec2.vue"))

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
  id: `Traffic.mjs`,
})

//________________________________________________________________________________
// EVENT HANDLERS
//________________________________________________________________________________
function clickTable(idx) {

}

function jumpTo(index) {
  const el = document.getElementById(`jump-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>


<template>
  <x-section :level="2" :visible="true" k="Websocket Logs">


    <template v-slot:header>
      <ExecButton icon="fa-info" :callback="() => apiMain.routeByEndpoint(logStore.documentation)"></ExecButton>
      <ExecButton icon="fa-flask" :callback="() => logApi.addTestPkt()">Test</ExecButton>
    </template>

      <x-collapse k="logStore">
        <x-json :obj="logStore"></x-json>
      </x-collapse>

      <div class="row mt-2 mb-3 align-items-center">
        <div class="col-auto">
          <x-toggle k="Logging Enabled" v-model="logStore.enabled"></x-toggle>
        </div>
        <div class="col-auto">
          <x-label k="Index"><a href="#" @click.prevent="jumpTo(logStore.historyIdx - 1)">{{ logStore.historyIdx - 1 }}</a></x-label>
        </div>
        <div class="col-auto">
          <ExecButton icon="fa-trash me-1" :callback=" () => logApi.clearLogs()">Clear Logs</ExecButton>
        </div>
      </div>

      <x-table-open :exclude="[]" :arr="logStore.history"  @select="clickTable">

        <template v-slot:default="slotProps">
          <div v-if="logStore.history[slotProps.v].type === 'EXEC_REQ'">
            <LogWsExec :v="logStore.history[slotProps.v]"></LogWsExec>
          </div>
          <div v-else-if="logStore.history[slotProps.v].type === 'EXEC2_REQ'">
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
  background-color: var(--bs-warning);
  color: var(--bs-dark);
  padding: 2px;
  font-weight: 800;
  font-size: 1.2rem;
}
</style>
