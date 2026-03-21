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
import {DEFAULTS, deepMerge, findHostnamePortProtocol} from "../CoreUtils.mjs"

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

  connectionName: "root",
  connectionType: "IslandDefault",
  islandConfigURL: "",
});

//________________________________________________________________________________
// CREATE DEFAULT ISLAND
//________________________________________________________________________________
function createDefaultIsland(connectionName) {
  const config = {}
  config.instanceId = connectionName
  deepMerge(config, DEFAULTS)
  config.routes = [
    {
      path: '/', name: 'root', children: [
        {path: '', redirect: `/${config.instanceId}/docs/Introduction.md`}
      ]
    }
  ]
  config.components = {
  }
  config.root = {
    icon: "fa-house",
    depth: 0,
    endpoint: "/",
    isLeaf: false,
    isRoot: true,
    name: "",
    path: [],
    children: []
  }
  config.type = "IslandDefault"
  return config
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
        throw new Error( `Unknown connection type: ${local.connectionType}`)
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
</script>


<template>
  <x-section :level="2" k="Connections">

    <div v-for="(v, k) in storeMain.r" class="row m-2">
      <ConnectionHeader :id="k"></ConnectionHeader>
    </div>

    <x-section :level="3" :visible="true" k="Create New Connection">
      <div class="row align-items-center">
        <div class="col">
          <x-input k="Name" v-model="local.connectionName"></x-input>
        </div>
        <div class="col-auto">
          <x-dropdown2 k="Type" :items="storeMain.registryType" v-model="local.connectionType"></x-dropdown2>
        </div>
      </div>
      <ExecButton icon="fa-floppy-disk me-1 " :callback="() => createConnectionByType()">Create connection by type
      </ExecButton>

      <h3>or</h3>
      <x-input k="Config URL" v-model="local.islandConfigURL"></x-input>
      <ExecButton icon="fa-floppy-disk me-1 " :callback="() => createConnectionByURL()">Create connection by URL
      </ExecButton>

    </x-section>

  </x-section>
</template>

<style scoped>

</style>
