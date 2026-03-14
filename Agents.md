# Agents

This document describes the autonomous actors, services, and subsystems that compose the C0ckp1t runtime. Each agent has a defined lifecycle, responsibilities, and communication patterns.

---

## Architecture Overview

C0ckp1t is a zero-build Vue 3 dashboard framework using an Islands Architecture. The system is composed of cooperating agents organized in three layers:

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  GlobalStore (orchestrator)                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │ Island 0 │  │ Island 1 │  │ Island N │  ...   │  │
│  │  │ (Default)│  │   (WS)   │  │   (WS)   │       │  │
│  │  └──────────┘  └────┬─────┘  └────┬─────┘       │  │
│  │                     │              │              │  │
│  │  ┌──────────────────┴──────────────┴───────────┐ │  │
│  │  │  Connection + WsClient + AuthNState          │ │  │
│  │  │  (per-island WebSocket lifecycle)            │ │  │
│  │  └──────────────────┬──────────────────────────┘ │  │
│  │                     │                             │  │
│  │  Theme │ Content │ NotifyUtils │ VueUtils │ ...  │  │
│  └───────────────────────────────────────────────────┘  │
│                        │ wss / https                     │
├────────────────────────┼────────────────────────────────┤
│  Server                │                                 │
│  ┌─────────────────────┴─────────────────────────────┐  │
│  │  WsServer (Express + ws)                          │  │
│  │  HTTP static serving + WebSocket endpoint handlers│  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

All client-side agents communicate through reactive state (`Vue.reactive()`), direct method calls, and an event bus (`mitt`). Server communication uses a binary msgpack WebSocket protocol with typed packet codes.

---

## Client-Side Agents

### GlobalStore

**Module**: `core/GlobalStore.mjs`
**Role**: Central orchestrator. Bootstraps the Vue application, creates and registers all islands, and maintains the global reactive store.

**Exports**: `store` (reactive), `api`

**Reactive State** (`store`):
| Property | Description |
|---|---|
| `r` | Registry map: `instanceId` -> island instance |
| `selectedInstId` | Currently active island's instance ID |
| `config` | Application configuration from `Constants.mjs` |
| `vueApp` | The Vue application instance |
| `router` | Vue Router instance |

**Lifecycle**:
1. `api.init(id, config)` is called from `index.html`
2. Creates the Vue app and Vue Router
3. Creates the default `IslandDefault` instance and registers it in `store.r`
4. Iterates over `config.islands` and creates an `Island` instance for each
5. Registers 30+ global async components (XInput, XLabel, XDropdown, etc.)
6. Mounts the Vue app to the DOM

**Key Methods** (`api`):
| Method | Description |
|---|---|
| `init(id, config)` | Bootstrap the entire application |
| `getRegistry(instanceId)` | Retrieve an island from `store.r` by ID |
| `getSelectedRegistry()` | Get the currently selected island |

**Communicates With**: Every other agent. GlobalStore is the root from which all islands and services are accessed.

---

### IslandDefault

**Module**: `core/IslandDefault.mjs`
**Role**: The default island for static/local content. Has no real WebSocket connection. Serves as the baseline island that is always present.

**Lifecycle**:
1. Created by `GlobalStore.init()` with the default config
2. Registered in `GlobalStore.store.r` under the default instance ID
3. Persists for the lifetime of the application

**Reactive State** (`store`):
| Property | Description |
|---|---|
| `instanceId` | Unique island identifier |
| `baseUrl` | Base URL for resolving assets |
| `nodes` | Navigation tree (from config) |
| `navTree` | Transformed navigation tree for sidebar rendering |

**Mock Connection State**: Provides a `connection` object with hardcoded values (`isConnected: true`, `isAuthenticated: false`) so that other code can treat it uniformly with full islands.

**Key Methods**:
| Method | Description |
|---|---|
| `resolver(url)` | Delegates to `fetch()` for loading SFC files |
| `exec()` | Returns `NOT_IMPLEMENTED` -- no backend execution |
| `getText(path)` | HTTP GET returning text |
| `getBinary(path)` | HTTP GET returning ArrayBuffer |
| `getJson(path)` | HTTP GET returning parsed JSON |
| `postJson(path, body)` | HTTP POST with JSON body |

---

### Island

**Module**: `core/Island.mjs`
**Role**: A full island instance backed by a real WebSocket connection. Each island represents an independent service/backend with its own connection, authentication, navigation tree, route subtree, and reactive state.

**Lifecycle**:
1. Created by `GlobalStore.init()` for each entry in `config.islands`
2. `init()` is called, which triggers `connect()`
3. `connect()` calls `connection.connect()` -> `userContext()` -> `rootNode()`
4. `rootNode()` fetches the node tree via `exec("/", ["infoNode"])` and recursively initializes routes
5. Lives for the duration of the application; reconnects automatically on disconnection

**Reactive State** (`store`):
| Property | Description |
|---|---|
| `instanceId` | Unique island identifier |
| `baseUrl` | Base URL for the island's backend |
| `nodes` | Raw navigation node tree from the server |
| `navTree` | Processed navigation tree for sidebar rendering |
| `connection` | Reference to the Connection agent |

**Key Methods**:
| Method | Description |
|---|---|
| `init()` | Initialize and connect |
| `connect()` | Establish WebSocket connection and fetch node tree |
| `exec(endpoint, args)` | Promise-based single request/response |
| `exec2(endpoint, args)` | Observable-based streaming execution |
| `exec2Result(endpoint, args)` | `exec2` with result mapping (START/STDOUT/STDERR/END) |
| `resolver(url)` | Resolves SFC files through the island's connection |
| `getText(path)` | HTTP GET returning text |
| `getBinary(path)` | HTTP GET returning ArrayBuffer |
| `getJson(path)` | HTTP GET returning parsed JSON |
| `postJson(path, body)` | HTTP POST with JSON body |

**Node Tree Initialization** (`_initializeRootNode`):
- Recursively walks the node tree from the server
- For each node, loads its config file (if any)
- Registers Vue Router routes for each node's pages
- Builds the `navTree` for sidebar rendering

**Exec Result Mapper** (`_createExecResultMapper`):
Maps streaming response packets to structured results with fields: `start`, `end`, `stdout`, `stdield`, `stderr`.

---

### Connection

**Module**: `core/ws-client/Connection.mjs`
**Role**: Manages the full WebSocket connection lifecycle for a single island. Contains a `WsClient` instance and an XState state machine actor.

**Lifecycle**:
1. Created by `Island` constructor
2. `connect()` sends `client.authenticate` to the state machine, which drives the lifecycle through: IDLE -> AUTHENTICATING -> CONNECTING -> CONNECTION_OK -> READY
3. On disconnection, the state machine transitions to DISCONNECTED and can retry

**Reactive State** (`state`):
| Property | Description |
|---|---|
| `connStateString` | Current connection state as string |
| `sessionStateString` | Current session state |
| `isConnected` | Whether the WebSocket is open |
| `isAuthenticated` | Whether authentication succeeded |
| `subscriptionCount` | Active RxJS subscriptions on the socket |
| `errorMessages` | Array of error messages |
| `retries` | Number of reconnection attempts |

**Reactive Store** (`store`):
| Property | Description |
|---|---|
| `hostname` | Server hostname |
| `port` | Server port |
| `protocol` | `ws` or `wss` |
| `connectionId` | Unique connection identifier |

**Key Methods**:
| Method | Description |
|---|---|
| `connect()` | Start the connection lifecycle (returns Promise) |
| `disconnect()` | Gracefully close the connection |
| `execute(endpoint, args)` | EXEC_REQ -> Promise-based single response |
| `execute2(endpoint, args)` | EXEC2_REQ -> Observable streaming response |
| `execute3(endpoint, args)` | EXEC3_REQ -> bidirectional streaming |
| `fetchCookie()` | POST session metadata to `/cookie` for auth |

**State Machine Actions** (methods called by XState):
`authenticate()`, `connecting()`, `connectedOk()`, `ready()`, `disconnected()`, `connectionNok()`, `authenticationFailed()`

---

### AuthNState

**Module**: `core/ws-client/AuthNState.mjs`
**Role**: XState v4 state machine definition that governs the WebSocket connection lifecycle.

**States**:
```
IDLE ──[client.authenticate]──> AUTHENTICATING
AUTHENTICATING ──[authenticate.ok]──> CONNECTING
AUTHENTICATING ──[authenticate.nok]──> AUTHENTICATION_FAILED
CONNECTING ──[client.connect.ok]──> CONNECTION_OK
CONNECTING ──[client.connect.nok]──> CONNECTION_NOK
CONNECTION_OK ──[connection.ok]──> READY
READY ──[client.error]──> DISCONNECTED
READY ──[client.closed]──> DISCONNECTED
READY ──[authenticate.update]──> AUTH_UPDATE
AUTH_UPDATE ──[authenticate.update.ok]──> READY
AUTH_UPDATE ──[authenticate.update.nok]──> DISCONNECTED
DISCONNECTED ──[client.authenticate]──> AUTHENTICATING
```

**Events**:
| Event | Trigger |
|---|---|
| `client.authenticate` | User/system initiates connection |
| `authenticate.ok` | Cookie fetch succeeded |
| `authenticate.nok` | Cookie fetch failed |
| `client.connect.ok` | WebSocket opened successfully |
| `client.connect.nok` | WebSocket failed to open |
| `connection.ok` | Post-connection handshake complete |
| `client.error` | WebSocket error |
| `client.closed` | WebSocket closed |
| `client.disconnect` | User-initiated disconnect |
| `authenticate.update` | Re-authentication requested |

---

### WsClient

**Module**: `core/ws-client/WsClient.mjs`
**Role**: Low-level WebSocket wrapper using RxJS `WebSocketSubject`. Handles binary serialization, packet routing, and subscription tracking.

**Connection States**:
| Code | State |
|---|---|
| 0 | IDLE |
| 1 | CONNECTING |
| 2 | CONNECTED |
| 3 | ERROR |
| 4 | CLOSED |

**Key Methods**:
| Method | Description |
|---|---|
| `connect(url)` | Opens a WebSocket via RxJS `WebSocketSubject` |
| `close()` | Closes the connection |
| `send(packet)` | Sends a single binary msgpack packet |
| `sendAndGetPromise(packet)` | Sends a packet and returns a Promise that resolves on the matching response (filtered by packet ID) |
| `sendAndGetObservable(packet)` | Sends a packet and returns an Observable of all responses matching the packet ID |

**Packet Routing**:
- Response packets are matched to requests by `id` field
- Server-initiated `EVENT` packets are routed to the global `eventBus` (mitt)
- Subscriptions are tracked; `subscriptionCount` is updated reactively

**Custom Close Codes**:
| Code | Meaning |
|---|---|
| 4001-4006 | C0ckp1t-specific error conditions |

---

### WsLogUtils

**Module**: `core/ws-client/WsLogUtils.mjs`
**Role**: WebSocket packet history logger. Maintains a circular buffer of the last 50 packets for debugging.

**Reactive State** (`store`):
| Property | Description |
|---|---|
| `history` | Array of logged packet entries |
| `idToIdxMap` | Map from packet ID to history index |

Tracks outbound requests and matches inbound responses by packet ID for correlated debugging.

---

### Theme

**Module**: `core/Theme.mjs`
**Role**: Dynamic theming engine. Generates and applies Bootstrap 5.3 CSS variable overrides at runtime. Supports light/dark mode, custom color editing, and 27+ Bootswatch presets.

**Exports**: `store` (reactive), `api`

**Reactive State** (`store`):
| Property | Description |
|---|---|
| `isDarkMode` | Current mode (light/dark) |
| `currentTheme` | Active theme name |
| `customColors` | User-edited color overrides |
| `presets` | Available theme presets |

**Key Methods** (`api`):
| Method | Description |
|---|---|
| `applyThemeToDOM()` | Injects/updates a `<style>` element with CSS variable overrides |
| `loadBootswatchTheme(name)` | Swaps the Bootstrap CSS file entirely for a Bootswatch theme |
| `toggleDarkMode()` | Switches between light and dark mode |
| `setCustomColor(name, value)` | Sets a custom color override |

**Built-in Presets**: default, ocean, forest, sunset, purple, monochrome

**Bootswatch Themes**: 27 themes including cerulean, cosmo, cyborg, darkly, flatly, journal, litera, lumen, lux, materia, minty, morph, pulse, quartz, sandstone, simplex, sketchy, slate, solar, spacelab, superhero, united, vapor, yeti, zephyr

**Color Utilities**: `hexToRgb()`, `darken()`, `lighten()`, `isLightColor()`

---

### Content

**Module**: `core/Content.mjs`
**Role**: Article and content manager. Fetches, caches, and indexes documentation articles. Uses IndexedDB (`idb-keyval`) for persistent client-side caching.

**Reactive State**:
| Property | Description |
|---|---|
| `articles` | Array of processed article objects |
| `articleTags` | Extracted tag index |
| `articlePathToSha1Table` | SHA1-based cache invalidation table |

**Key Methods**:
| Method | Description |
|---|---|
| `fetchArticles()` | Loads articles from `/documentation/published_articles.json` |
| `cacheGet(key)` | Read from IndexedDB |
| `cachePut(key, value)` | Write to IndexedDB |
| `cacheDelete(key)` | Remove from IndexedDB |

**Cache Strategy**: Articles are SHA1-hashed. On fetch, the hash is compared to the cached version; stale entries are re-fetched and updated.

---

### NotifyUtils

**Module**: `core/notify/NotifyUtils.mjs`
**Role**: Notification system. Provides a queue-based notification API consumed by a toast Vue component.

**Notification Types**: `GOOD`, `BAD`, `INFO`

**Reactive State** (`store`):
| Property | Description |
|---|---|
| `notifyQueue` | Pending notifications for toast rendering |
| `notifyHistory` | Log of all past notifications (max 50) |

**Key Methods**:
| Method | Description |
|---|---|
| `good(message)` | Success notification |
| `bad(message)` | Error notification |
| `info(message)` | Informational notification |
| `goodDetails(title, details)` | Success with expandable details |
| `badDetails(title, details)` | Error with expandable details |
| `infoDetails(title, details)` | Info with expandable details |
| `exec2Error(error)` | Format an exec2 streaming error |
| `exec2ErrorLoading(error)` | Format a loading error from exec2 |
| `exec2CompleteLoading(result)` | Notify on exec2 stream completion |
| `log(type, message)` | Add entry to history |
| `clearNotifyHistory()` | Clear the history log |

---

### VueUtils

**Module**: `core/VueUtils.mjs`
**Role**: Configures `vue3-sfc-loader` for runtime `.vue` file compilation and transforms route configurations into Vue Router format.

**Module Cache**: Pre-registers `vue`, `vue-router`, `JsUtils`, `WsUtils`, `Logging`, `NotifyUtils`, `GlobalStore` so that SFC `<script>` blocks can import them directly.

**Key Methods**:
| Method | Description |
|---|---|
| `loadModule(url, instanceId)` | Loads and compiles a `.vue` file via `vue3-sfc-loader` |
| `transformRoutes(routes, instanceId)` | Converts declarative route config (with `location` property) into Vue Router route objects with lazy-loaded components |

**SFC Loader Hooks**:
| Hook | Behavior |
|---|---|
| `getFile(url)` | Routes file fetches to the appropriate island's `resolver()` based on `instanceId` |
| `addStyle(style)` | Injects component-scoped `<style>` into the DOM |
| `handleModule(type, source)` | Handles `.png`, `.svg`, `.json`, and `esm.sh` imports |
| `isCustomElement(tag)` | Marks `json-viewer` and `katex` as custom elements |

**Source Caching**: Compiled SFC sources are cached with SHA1 hashes for invalidation.

---

### WsUtils

**Module**: `core/WsUtils.mjs`
**Role**: WebSocket protocol definitions, binary serialization, HTTP helpers, and the global event bus.

**Packet Codes** (`Code2` -- current protocol):
| Code | Name | Direction | Description |
|---|---|---|---|
| `ACCEPT` | Accept | Server -> Client | Acknowledges a request |
| `COMPLETE` | Complete | Server -> Client | Marks end of a request/response cycle |
| `EXEC_REQ` | Execute Request | Client -> Server | Single request |
| `EXEC_RESP` | Execute Response | Server -> Client | Single response |
| `EXEC2_REQ` | Execute2 Request | Client -> Server | Streaming request |
| `EXEC2_RESP` | Execute2 Response | Server -> Client | Streaming response chunk |
| `EXEC3_REQ` | Execute3 Request | Client -> Server | Bidirectional stream open |
| `EXEC3_PUSH` | Execute3 Push | Client -> Server | Push data into bidirectional stream |
| `EXEC3_RESP` | Execute3 Response | Server -> Client | Bidirectional stream response chunk |
| `EXEC3_CLOSE` | Execute3 Close | Client -> Server | Close bidirectional stream |
| `EVENT` | Event | Server -> Client | Server-pushed event |
| `ERROR` | Error | Server -> Client | Error response |

**Packet Structure** (msgpack binary):
```
{ id, code, endpoint, args, bytes }
```

**Serialization**: `toBinary(packet)` / `fromBinary(buffer)` using msgpack

**HTTP Helpers** (`Http`):
| Method | Description |
|---|---|
| `getText(url)` | GET -> text |
| `getBinary(url)` | GET -> ArrayBuffer |
| `getJson(url)` | GET -> parsed JSON |
| `postJson(url, body)` | POST with JSON -> parsed JSON |

**Event Bus**: `eventBus` (mitt instance). Server EVENT packets are published here. Common event topics: `/alert`, `/invalidate`, `/refresh`.

**Utilities**: `generateRandomInt32()`, `ok(data)`, `nok(error)`, `assert(condition, message)`

---

### Logging

**Module**: `core/Logging.mjs`
**Role**: Logging facade over the `loglevel` library with `loglevel-plugin-prefix` for formatted output.

**Key Methods**:
| Method | Description |
|---|---|
| `getLogger(location)` | Creates or retrieves a named logger |
| `setLogger(location, level)` | Sets log level and persists to localStorage |
| `init(config)` | Loads default log levels from app config |

**Log Levels**: `trace`, `debug`, `info`, `warn`, `error`, `silent`

---

### JsUtils

**Module**: `core/JsUtils.mjs`
**Role**: General-purpose utility library. Stateless -- no lifecycle or reactive state.

**Categories**:
| Category | Functions |
|---|---|
| Crypto | `sha256()`, `sha1()` |
| String | `extractBasePath()`, `substrAfterFirstSlash()`, `endpointToRouterName()`, `capitalizeFirstLetter()`, `extractLastPath()`, `truncateAndKeepLast()`, `truncateAndKeepFirst()`, `parentPath()`, `leafPath()`, `splitPathString()`, `cleanFileName()` |
| Data | `sortByPropertyAsc()`, `sortByPropertyDesc()`, `sortObjectKeysWithIdFirst()`, `groupArrayByProperty()`, `groupObjectByProperty()` |
| Conversion | `bytesToMB()`, `formatBytes()`, `formatDuration()`, `convertMsToString()` |
| Validation | `indexOfNonString()`, `startsWithLetter()` |
| Result | `ok(data)`, `nok(error)` |

---

### DocUtils

**Module**: `core/DocUtils.mjs`
**Role**: Documentation path resolution. Maps between browser paths, remote server paths, and local document paths.

**Key Methods**:
| Method | Description |
|---|---|
| `retrieveText(path)` | Fetches a document via the island registry's `getText()` |
| `normalizePath(path)` | Resolves `.` and `..` segments |
| `extractBasePathFromURL(url)` | Finds the `/docs` marker in a URL |

Uses `Content.mjs` cache for SHA1-based invalidation.

---

## Server-Side Agents

### WsServer

**Module**: `c0ckp1t-server/src/WsServer.mjs`
**Role**: Combined HTTP + WebSocket server. Express for static file serving and REST endpoints. `ws` library for WebSocket connections. Handles the server side of the binary msgpack protocol.

**Lifecycle**:
1. Instantiated with config (port, webroot, ws-path)
2. Sets up Express middleware (static files, JSON body parsing, SPA fallback)
3. Upgrades HTTP connections to WebSocket on the configured path
4. Listens for incoming packets and routes to registered endpoint handlers

**Key Methods**:
| Method | Description |
|---|---|
| `registerEndpoint(endpoint, handler)` | Register a handler for a named endpoint |
| `broadcast(event)` | Send an EVENT packet to all connected clients |

**Endpoint Handler Signatures**:
| Request Type | Handler Signature |
|---|---|
| `EXEC_REQ` | `handler(args)` -> returns result (wrapped in EXEC_RESP + COMPLETE) |
| `EXEC2_REQ` | `handler(args, emit)` -> calls `emit(data)` multiple times, returns (COMPLETE sent automatically). Also supports async iterables. |
| `EXEC3_REQ` | `handler(args, stream)` -> `stream.onPush(fn)`, `stream.onClose(fn)`, sends EXEC3_RESP packets |

**Error Handling**: On handler error, sends ERROR + COMPLETE packets to the client.

---

### c0ckp1t-server

**Module**: `c0ckp1t-server/src/c0ckp1t-server.mjs`
**Role**: Server entry point. CLI interface using Commander.

**Configuration** (CLI flags):
| Flag | Default | Description |
|---|---|---|
| `--port` | 3041 | Server port |
| `--webroot` | `../` | Path to static files |
| `--ws-path` | `/socket` | WebSocket endpoint path |

**Behavior**:
- Serves static files from the webroot
- SPA fallback: non-file routes serve `index-cdn.html`
- Graceful shutdown on SIGINT / SIGTERM

---

## Communication Patterns

### WebSocket Protocol Flow

**Authentication**:
```
Client                          Server
  │                               │
  ├── POST /cookie ──────────────>│  (session metadata: user, password, userAgent, window/screen size)
  │<──────────── Set-Cookie ──────┤
  │                               │
  ├── WebSocket UPGRADE ─────────>│  (ws(s)://host:port/socket?connectionId=X)
  │<──────────── 101 Switching ───┤
```

**EXEC_REQ** (single request/response):
```
Client                          Server
  │── EXEC_REQ ──────────────────>│
  │<──────────── ACCEPT ──────────│
  │<──────────── EXEC_RESP ───────│  (result in bytes)
  │<──────────── COMPLETE ────────│
```

**EXEC2_REQ** (streaming):
```
Client                          Server
  │── EXEC2_REQ ─────────────────>│
  │<──────────── ACCEPT ──────────│
  │<──────────── EXEC2_RESP ──────│  (chunk 1)
  │<──────────── EXEC2_RESP ──────│  (chunk 2)
  │<──────────── ...              │
  │<──────────── COMPLETE ────────│
```

**EXEC3_REQ** (bidirectional):
```
Client                          Server
  │── EXEC3_REQ ─────────────────>│
  │<──────────── ACCEPT ──────────│
  │── EXEC3_PUSH ────────────────>│  (client data)
  │<──────────── EXEC3_RESP ──────│  (server data)
  │── EXEC3_PUSH ────────────────>│
  │<──────────── EXEC3_RESP ──────│
  │── EXEC3_CLOSE ───────────────>│
  │<──────────── COMPLETE ────────│
```

**Server-Pushed Events**:
```
Server ── EVENT ──> WsClient ── eventBus (mitt) ──> subscribers
```
Common event topics: `/alert`, `/invalidate`, `/refresh`

---

## Agent Interaction Map

```
GlobalStore
  ├── creates & registers ──> IslandDefault
  ├── creates & registers ──> Island (one per config entry)
  │                             ├── owns ──> Connection
  │                             │              ├── owns ──> WsClient (RxJS WebSocket)
  │                             │              ├── driven by ──> AuthNState (XState machine)
  │                             │              └── logged by ──> WsLogUtils
  │                             ├── uses ──> VueUtils (SFC loading, route transforms)
  │                             └── uses ──> NotifyUtils (error/success feedback)
  ├── configures ──> Theme
  ├── configures ──> Logging
  └── configures ──> Content

WsUtils
  ├── provides ──> protocol codes, serialization, HTTP helpers
  └── provides ──> eventBus (global mitt instance)

JsUtils ──> stateless utilities used everywhere
DocUtils ──> uses Content + island registry for document resolution
```
