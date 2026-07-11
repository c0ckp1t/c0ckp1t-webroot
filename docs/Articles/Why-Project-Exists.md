
# Why does this project exists?

Modern frontend tooling has become extraordinarily complex. Transpilation steps, dependencies, configuration files, deployment scripts — all of it adds friction between you and the thing you're actually trying to build: **a great user interface**.

**The C0ckp1t UI Framework** strips that friction away. Here's why it exists and what makes it different.

---

### Zero-Build, Instant Development

C0ckp1t uses [vue3-sfc-loader](https://github.com/FranckFreiburger/vue3-sfc-loader) to compile Vue Single File Components at runtime, directly in the browser. That means:

- **No Webpack. No Vite. No Rollup.** Write a `.vue` file, serve it, and it renders.
- **Instant iteration.** Change your component, refresh the page, see the result. No build queue, no hot-module-replacement quirks.
- **Minimal footprint.** The entire core framework loads in ~2.2 MB. Everything else is lazy-loaded on demand.

This isn't just convenient — it fundamentally changes how fast you can prototype, experiment, and ship.

**Note**: 1.8 MB out of the 2.2 MB is the Vue 3 runtime and compiler, which is a small price to pay for the flexibility of SFCs without a build step. And you can remove this dependency and compile if you really wanted to.

---

### Rich, Ready-to-Use Component Library

C0ckp1t comes batteries-included with three tiers of components:

| Category | Examples | Description |
|---|---|---|
| **Bootstrap** | Buttons, cards, forms, navbars | Standard Bootstrap building blocks, fully themed |
| **Basic Components** | `x-input`, `x-table-open`, `x-tabs`, `x-dropdown`, `x-toggle`, `x-json` | Reactive Vue wrappers that extend Bootstrap with data-binding and interactivity |
| **Advanced Components** | `v-ace-editor`, `code-mirror`, `x-terminal`, `x-markdown`, `x-sound`, `x-upload`, `x-tree` | Full-featured widgets — code editors, audio players, tree views, Markdown renderers, file uploaders |

They are lazy loaded when used automatically. You can use them as-is, download and customize them, or replace them entirely with your own.

---

### Islands Architecture with WebSocket Support

HTTP is simple, but many real-world applications demand **real-time, bidirectional communication**. C0ckp1t's architecture is built around the concept of **Islands** — modular connection endpoints that abstract your backend communication:

- **`IslandDefault`** — Connects over standard HTTP. This is the default Island, bound to the server that serves your `index.html`.
- **`Island`** — Connects over WebSockets for persistent, real-time data streaming.

You can register multiple Islands, each connecting to a different backend, and route between them seamlessly using Vue Router. The API is unified — your components don't need to care whether data arrives over HTTP or a WebSocket.

```javascript
// Register a WebSocket-backed Island
await api.registerIsland({
  instanceId: "live-data",
  type: "Island",
  routes: [/* your routes */]
});
```

---

### Local-First by Design

C0ckp1t is built for **local-first applications** — software that works without an internet connection and keeps data close to the user.

- **Serve everything locally.** The entire framework, including all external JS libraries, can be downloaded and served from your own machine. No CDN dependency required in production.
- **IndexedDB persistence.** Built-in `Stash` (IndexedDB wrapper) stores Island configurations and application state directly in the browser.
- **Offline-capable.** Pair C0ckp1t with a local server and your application runs entirely on your machine — fast, private, and resilient.
- **CDN or local — your choice.** Every dependency can be sourced from a CDN during development and switched to local files for deployment with a single line change in your `importmap`.

```javascript
// During development — load from CDN:
"IslandDefault": "https://cdn.jsdelivr.net/npm/c0ckp1t@latest/core/IslandDefault.mjs"

// In production — serve locally:
// This is how to override a core module with a local file. You can do this for 
//  any single file, or the entire framework.
"IslandDefault": "./core/IslandDefault.mjs"
```

---

### Built for the Age of Large Language Models

This is where C0ckp1t's architecture becomes truly powerful.

Vue Single File Components are **self-contained, cleanly scoped, and isolated** — which makes them an ideal generation target for LLMs. Each `.vue` file encapsulates its own template, logic, and styling in a single, well-defined unit. 

Because C0ckp1t compiles SFCs at runtime, an LLM can generate a `.vue` component and **it can be rendered immediately** — no compilation step, no bundling, no deployment pipeline.

**Imagine this:** You ask a question, and instead of getting a wall of text or a static table, the system generates a fully interactive Vue component on the fly — with filters, sorting, icons, hover states, charts, or whatever presentation best fits your data. That component loads instantly into your C0ckp1t application through `loadModuleFromText()`.

```javascript
// Load a dynamically generated SFC from a string
const component = await api.loadModuleFromText(llmGeneratedVueCode, "DynamicResult");
```

This is not a hypothetical future. C0ckp1t gives you the infrastructure to build this **today**:

- **Dynamic component loading** — render any `.vue` SFC from a URL or from raw text at runtime
- **Unified backend connectivity** — stream LLM responses over WebSockets in real time
- **A complete component library** — LLMs can compose with existing components (`x-table-open`, `x-tree`, `x-code`, `x-markdown`) instead of generating everything from scratch

> **The future of interfaces is adaptive.** Instead of designing one static UI for every possible use case, you generate the right interface for the right context, on demand. C0ckp1t is the runtime that makes that possible.

---

### Manage Complexity, Not Configuration

The key imperative of software engineering is managing complexity. C0ckp1t's design reflects this:

- **One file = one component.** Vue SFCs enforce clean boundaries. Template, logic, and style live together — no hunting across file trees.
- **No build configuration.** Zero `webpack.config.js`, zero `vite.config.ts`, zero `tsconfig.json`. The framework's entire configuration lives in a single `config.mjs` and your `index.html` importmap.
- **Modular core.** The framework is composed of small, focused modules (`GlobalStore.mjs`, `VueUtils.mjs`, `WsUtils.mjs`, `ConfigUtils.mjs`) that you can inspect, replace, or extend individually.
- **Lazy loading by default.** Only the core modules load upfront. Advanced components and external libraries (Ace, CodeMirror, WaveSurfer, KaTeX, highlight.js, etc.) load on demand when a component that needs them is first rendered.

---




## The Vision

Today **C0ckp1t** gives you a fast, zero-build Vue framework with real-time connectivity and a rich component library. Tomorrow, it's the runtime where an LLM generates a custom, interactive data visualization the moment you need it — tailored to your exact context, rendered instantly, no build step in sight.

**This is the foundation. Start building on it.**

---