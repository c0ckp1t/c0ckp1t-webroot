<script setup>
/*
    c0ckp1t-toast.vue
*/

//________________________________________________________________________________  
// IMPORTS
//________________________________________________________________________________  
import {reactive, markRaw, watch, watchEffect, onMounted, computed, ref, version} from 'vue'
import {api as apiMain} from 'GlobalStore'
import {store as notifyStore, api as notifyApi} from 'NotifyUtils'
import {getLogger, listLoggers, setLogger, clearLocalStorage} from "Logging";
import { eventBus } from 'WsUtils'

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'notify/notify-logs.vue'
const logger = getLogger(LOG_HEADER)
logger.info("[INIT]")

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  filter: "",
})

const loggers = ref({})

const loggersSorted = computed(() => {
  const res = []
  for (const key of Object.keys(loggers.value)) {
    res.push({name: key, level: loggers.value[key]});
  }
  return res
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(obj => {
        if (local.filter.trim() === '') return true
        return obj.name.includes(local.filter)
      })
});

// ________________________________________________________________________________
// EVENTS
// ________________________________________________________________________________
function generateNotify() {
  logger.info("generateNotify()")
  notifyApi.good("good notify test")
  notifyApi.bad("bad notify test")
  notifyApi.info("info notify test")
}

function generateClientEvent() {
  eventBus.emit('foo', { a: 'b' })
}

function updateLoggers() {
  loggers.value = {...listLoggers()}
}

function clickSetLogger(name, level) {
  setLogger(name, level)
  updateLoggers()
}

function changeOrder(selection) {
  if (selection === 'name') {
  }

  if (selection === 'level') {
  }

}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
onMounted(() => {
  loggers.value = listLoggers()
})

</script>


<template>
  <x-section extra="fs-4" :visible="true" k="Notification">

    <template v-slot:header>
      <ExecButton icon="fa-info" :callback="() => apiMain.selectDocumentation(notifyStore.documentation)"></ExecButton>
    </template>

    <x-section extra="fs-4" :visible="true" k="Queued">
      <button @click="generateNotify" class="btn btn-dark mb-2">Generate Notify</button>
      <button @click="generateClientEvent" class="btn btn-dark mb-2">Generate Client Event</button>

      <x-table-open :exclude="['']" :arr="notifyStore.notifyQueue" v-slot="slotProps">
      </x-table-open>
    </x-section>

    <x-section extra="fs-4" :visible="true" k="Archive">
      <ExecButton :callback=" () => notifyApi.clearNotifyHistory()" icon="fa-trash me-1" class="btn btn-dark mb-2">Clear
      </ExecButton>

      <x-table-open :exclude="['']" :arr="notifyStore.notifyLog" v-slot="slotProps">
      </x-table-open>
    </x-section>


    <x-section extra="fs-4" :visible="true" k="Logger Configuration">
      <ExecButton :callback=" () => updateLoggers" icon="fa-rotate-right me-1" class="btn btn-dark me-2 mb-2"></ExecButton>
      <ExecButton :callback=" () => clearLocalStorage" icon="fa-trash me-1" class="btn btn-dark mb-2">Clear Local Storage
      </ExecButton>

      <div class="row mb-2">
        <x-input k="Filter" v-model="local.filter"></x-input>
      </div>

      <table class="table table-sm">
        <thead>
        <tr title="click to order">
          <th v-on:click="changeOrder('name')"><span>Name</span></th>
          <th v-on:click="changeOrder('level')"><span>Level</span></th>
        </tr>
        </thead>

        <tr v-for="logger in loggersSorted" :key="logger.name">
          <td>{{ logger.name }}</td>
          <td>
            <div>
              <button @click="clickSetLogger(logger.name, 'TRACE')" :class="(logger.level ==='TRACE') ? 'btn-primary' : 'btn-light'"
                      class="btn btn-sm ">TRACE
              </button>
              <button @click="clickSetLogger(logger.name, 'DEBUG')" :class="(logger.level === 'DEBUG') ? 'btn-success' : 'btn-light'"
                      class="btn btn-sm ">DEBUG
              </button>
              <button @click="clickSetLogger(logger.name, 'INFO')" :class="(logger.level ==='INFO') ? 'btn-info' : 'btn-light'"
                      class="btn btn-sm">INFO
              </button>
              <button @click="clickSetLogger(logger.name, 'WARN')" :class="(logger.level==='WARN') ? 'btn-warning' : 'btn-light'"
                      class="btn btn-sm">WARN
              </button>
              <button @click="clickSetLogger(logger.name, 'ERROR')" :class="(logger.level==='ERROR') ? 'btn-danger' : 'btn-light'"
                      class="btn btn-sm">ERROR
              </button>
            </div>
          </td>
        </tr>
      </table>

    </x-section>

  </x-section>
</template>