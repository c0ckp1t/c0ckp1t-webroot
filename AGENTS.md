# AGENTS.md

## Project Intent & Tech Stack

This project is called `C0ckp1t` it is a Zero-Build Vue.js Framework. It can compile `.vue` (Single File Components) at runtime (in the browser) via [vue3-sfc-loader](https://github.com/FranckFreiburger/vue3-sfc-loader), this means no Webpack/Vite build step required. It comes with many reusable Vue components and [Bootstrap](https://getbootstrap.com/) is supported with themes provided. 

## Critical Constraints

* Do not use npm. Do not compile anything.
* Use ES6 import and export. This code is designed to run on browser.

## Development Workflows


## Code Style & Architecture

`index.html` is the web application entry point. It loads global JavaScript dependencies and also initializes the Vue application. 

`core/GlobalStore.mjs` -  Central orchestrator. Bootstraps the Vue application, creates and registers all islands, and maintains the global reactive store.

1. `api.init(id, config)` is called from `index.html`
2. Creates the Vue app and Vue Router
3. Creates the default `IslandDefault` instance and registers it in `store.r`
4. Iterates over `config.islands` and creates an `Island` instance for each
5. Registers 30+ global async components (XInput, XLabel, XDropdown, etc.)
6. Mounts the Vue app to the DOM

`core/VueUtils.mjs` -  Configures `vue3-sfc-loader` for runtime `.vue` file compilation and transforms route configurations into Vue Router format.  Pre-registers `vue`, `vue-router`, `JsUtils`, `WsUtils`, `Logging`, `NotifyUtils`, `GlobalStore` so that SFC `<script>` blocks can import them directly.

`core/Island.mjs` - A full island instance backed by a real WebSocket connection. Each island represents an independent service/backend with its own connection, authentication, navigation tree, route subtree, and reactive state.

1. Created by `GlobalStore.init()` for each entry in `config.islands`
2. `init()` is called, which triggers `connect()`
3. `connect()` calls `connection.connect()` -> `userContext()` -> `rootNode()`
4. `rootNode()` fetches the node tree via `exec("/", ["infoNode"])` and recursively initializes routes
5. Lives for the duration of the application; reconnects automatically on disconnection

**Node Tree Initialization** (`_initializeRootNode`):
- Recursively walks the node tree from the server
- For each node, loads its config file (if any)
- Registers Vue Router routes for each node's pages
- Builds the `navTree` for sidebar rendering


`core/IslandDefault.mjs` - island for the servers that use HTTP instead of websockets. Usually there is a default connection for the server that loads the webpage, i.e, the websever serving these files.

## SFC Components

Code location: ./components

Components have been organized in three categories: **Bootstrap**, **Basic Components**, **Advanced Components**.
These components are globally registered with VueJs and available in any SFC.

**Basic Components** - These are the basic components that are commonly used in web applications, they are built on top of Bootstrap and VueJs provide additional functionality and styling, but mostly importantly they are **reactive** and have no dependencies, so that is why they are called basic.

*  x-input
*  x-label
*  ExecButton
*  x-checkbox
*  x-check
*  x-toggle
*  x-toggle3
*  x-collapse
*  x-list
*  x-kv
*  x-map
*  x-dropdown
*  x-dropdown2
*  x-json
*  x-section
*  x-table-open
*  x-nav
*  x-tabs


### Common Example

```html
<x-map k="Global KV" v-model="entity.kv" />

types: [
{k: "STRING", v: "STRING"},
{k: "JSON", v: "JSON"},
{k: "NUMBER", v: "NUMBER"},
]
<x-drop-down k="Route Type: " :items="['STATIC', 'SIMPLE']" v-model="local.routeType" />

<x-json :obj="local.kv"/>
<x-json :obj="local.kv" :expanded="true"/>
     <x-tabs>
        <template #header>
          <h1>Header</h1>
        </template>
        <template #footer>
          <h4>Footer</h4>
        </template>
      </x-tabs>

<x-checkbox k="My Check Box" v-model="local.myCheckBox"/>
<x-checkbox k="My Check Box" v-model="local.myCheckBox" inline />
<x-checkbox k="My Check Box" v-model="local.myCheckBox" disabled />

<x-label k="k">my label value template</x-label>
<x-label k="k" :isCompact="true">my label value template</x-label>
<x-label k="k">https://example.com</x-label>

<x-input k="k" v-model="local.xInputText"/>
<x-input k="k" v-model="local.xInputTextNumber" type="Number"/>
<x-input k="k" v-model="local.xInputText" :showLabel="false"/>
<x-input k="k" v-model="local.xInputText"
         :styleObject="{'border': '1px solid red'}"
         :inputStyle="{'border': '1px solid green'}"/>

<ExecButton icon="fa-heart me-1"  :callback="() => health()">Health</ExecButton>
<ExecButton class="btn btn-primary" icon="fa-heart me-1"  :callback="() => health()">Health</ExecButton>

<!-- With color override -->
<x-section :level="3" color="danger" k="Warning Section"></x-section>

<!-- With header slot for buttons/actions -->
<x-section :level="3" k="Configuration">
    <template v-slot:header>
        <button class="btn btn-light btn-sm ms-4">Save</button>
    </template>

    <x-input k="Port" type="Number" v-model="local.config.port"></x-input>
</x-section>
```

### Tables 

The tables work a lot like the x-section where when you click on a row of a table it expands and shows the content, within that content you can have buttons to perform actions on that resource


```html

<x-table-open :exclude="local.exclude" :arr="storeRepo.items" v-slot="slotProps" @select="clickTable">
    <div class="container-fluid" :class="{'is-dirty': storeRepo.isDirty[slotProps.v]}">
        <entity v-model="storeRepo.items[slotProps.v]"></entity>
    </div>
    <!--  !# C0CKP1T_START body -->

    <!--  !# C0CKP1T_END -->
</x-table-open>
<div v-if="storeRepo.items.length === 0">
    <h3>No Items</h3>
</div>

<x-table-open :exclude="[]" :arr="local.myTableData" v-slot="slotProps">
    {{ local.myTableData[slotProps.v] }}
</x-table-open>

<div v-if="local.myTableData.length === 0">
    <h3>No Items</h3>
</div>

<x-table-open :exclude="[]" :arr="local.myTableData" >

    <template v-slot:name="props">
        <span style="font-weight: bold">{{props}}</span>
    </template>

    <template v-slot:default="slotProps">
        <span > {{slotProps}}</span>
    </template>

</x-table-open>
```

### Advanced Components 

These are more complex components that provide advanced functionality, but the main difference is they have dependencies on the **Basic Components** or on external JavaScript code.

* x-upload
* x-tree
* v-ace-editor
* x-terminal
* code-mirror
* x-sound
* x-code
* x-code-slot
* x-markdown

```html

<v-ace-editor v-model="local.resultText" lang="kotlin" theme="twilight"
              style="height: 800px" />


<x-tree :items="treeData" @select="onSelect" />

// treeData is an Array of Node objects:
Node {
label: String,           // Display text
path: String,            // Unique identifier/path
isDirectory: Boolean,    // true = folder icon, false = file icon
expanded: Boolean,       // Initial expanded state (directories only)
children: Array<Node>,   // Child nodes (empty array [] for files/empty folders)
    }
```

