<script setup>
/**
 * Page for managing connections (also known as Islands)
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, onMounted, defineAsyncComponent, computed} from 'vue'
import {store as storeMain, api as apiMain} from 'GlobalStore'
import {getLogger} from "Logging";
import {api as notify} from "NotifyUtils"
import {findHostnamePortProtocol, validateAndCleanIslandConfig} from "ConfigUtils"

const ConnectionHeader = defineAsyncComponent(() => import("./connections/connection-header.vue"))

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'pages/Connections.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

//________________________________________________________________________________
// STATE
//________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  moduleCache: null,

  storedConnectionsExclude: ['connection', 'WITH_CREDENTIALS', 'appEndpoint', 'routes', 'root'],
  storedConnections: [],
  connectionName: "root",
  connectionType: "Island",
  islandConfigURL: "",
});

//________________________________________________________________________________
// CREATE DEFAULT ISLAND
//________________________________________________________________________________
function createDefaultIsland(connectionName, validateAndCleanIslandConfig) {
  const config = {
    instanceId: connectionName
  }
  return validateAndCleanIslandConfig(config)
}

//________________________________________________________________________________
// CREATE REMOTE ISLAND
//________________________________________________________________________________
function createRemoteIsland(connectionName) {
  const {hostname, port, protocol, isSecure} = findHostnamePortProtocol()
  return {
    isDev: false,
    WITH_CREDENTIALS: false,
    instanceId: connectionName,
    type: "Island",
    appEndpoint: "",

    connection: {
      readOnly: true,
      hostname: hostname,
      port: port,
      protocol: protocol,
      endpoint: "socket",
      username: "anonymous",
      password: "anonymous",
      isSecure: isSecure,
    }
  }
}

//________________________________________________________________________________
// PRIVATE
//________________________________________________________________________________
async function createConnectionByType() {
  let config = null
  try {
    switch (local.connectionType) {
      case "IslandDefault":
        config = createDefaultIsland(local.connectionName)
        break
      case "Island":
        config = createRemoteIsland(local.connectionName)

        break
      default:
        throw new Error(`Unknown connection type: ${local.connectionType}`)
    }
    await apiMain.registerIsland(config)
  } catch (e) {
    notify.badDetails(`[${local.id}]`, e)
  }
}

function createConnectionByURL() {
  logger.info(`Creating connection by URL: ${local.islandConfigURL}`)
  logger.error("Not implemented yet")
}

async function loadStoredConfiguration() {
  // 1. Load stored configs from IndexedDB
  const storedList = await apiMain.listStoredIslandConfigs() || []
  const storedMap = {}
  for (const cfg of storedList) {
    storedMap[cfg.instanceId] = cfg
  }
  const merged = []

  // 2. Running islands take precedence (registry.config overwrites stored config)
  for (const [instanceId, registry] of Object.entries(storeMain.r)) {
    const storedCfg = storedMap[instanceId]

    const displayCfg = {
      ...(storedCfg ?? {}),          // start with stored config (if any)
      ...registry.config,            // overlay with live registry config
      isStored: !!storedCfg,
      isRunning: true
    }

    merged.push(displayCfg)
  }
  // 3. Add stored configs that are not currently running
  for (const cfg of storedList) {
    if (!storeMain.r[cfg.instanceId]) {
      merged.push({
        ...cfg,
        isStored: true,
        isRunning: false
      })
    }
  }
  local.storedConnections = merged
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
  if (storeMain.isReady) {
    await loadStoredConfiguration()
  } else {
    setTimeout(() => {
      init()
    }, 500)
  }
}

onMounted(() => {
  init()
})
</script>


<template>
  <x-section :level="2" k="Connections">
    <template v-slot:header>
      <ExecButton icon="fa-rotate-right " :callback="() => loadStoredConfiguration()"/>
    </template>

    <x-table-open :exclude="local.storedConnectionsExclude" :arr="local.storedConnections" v-slot="slotProps"
                  idField="instanceId">

      <ExecButton icon="fa-trash me-1"
                  :callback="() => apiMain.deleteIslandConfig(local.storedConnections[slotProps.v].instanceId)">
        Delete
      </ExecButton>

      <ConnectionHeader :id="local.storedConnections[slotProps.v].instanceId"  :key="local.storedConnections[slotProps.v].instanceId"/>

      <x-json :obj="local.storedConnections[slotProps.v]"/>
    </x-table-open>


    <x-section :level="3" :visible="true" k="Create New Connection">
      <div class="row align-items-center">
        <div class="col">
          <x-input k="Name" v-model="local.connectionName"/>
        </div>
        <div class="col-auto">
          <x-dropdown2 k="Type" :items="storeMain.registryType" v-model="local.connectionType"/>
        </div>
      </div>
      <ExecButton icon="fa-floppy-disk me-1 " :callback="() => createConnectionByType()">
        Create connection by type
      </ExecButton>

      <h3>or</h3>
      <x-input k="Config URL" v-model="local.islandConfigURL"/>
      <ExecButton icon="fa-floppy-disk me-1 " :callback="() => createConnectionByURL()">
        Create connection by URL
      </ExecButton>

    </x-section>

  </x-section>
</template>

<style scoped>

</style>
