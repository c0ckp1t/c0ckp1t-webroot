

# Components


The components have been organized in three categories: **Bootstrap**, **Basic Components**, **Advanced Components**.
 
## Bootstrap 

Default Bootstrap components, these are the building blocks of the framework.

* [Demo - Bootstrap Components](http://c0ckp1t.com/default/components/basic)
 
## Basic Components

These are the basic components that are commonly used in web applications, they are built on top of Bootstrap and VueJs provide additional functionality and styling, but mostly importantly they are **reactive**.

* [Demo - Vue Components](/default/components/bootstrap) 
* [Source Code](https://github.com/c0ckp1t/c0ckp1t-webroot/tree/main/components)
  * Documentation is on the component source code (and demo page)
* Basic Components include:
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
 
You can download all or one of components and serve them locally to make modifications. See [Configuration](./Configuration.md) for more details on how to add your own components or modify the existing ones.

## Advanced Components

These are more complex components that provide advanced functionality, but the main difference is they dependencies on the **Basic Components** or on external JavaScript code. 

* [Demo - Vue Advanced Components](/default/components/advanced) - code editor, audio player, tree view, etc
* [Source Code](https://github.com/c0ckp1t/c0ckp1t-webroot/tree/main/components)
  * Documentation is on the component source code (and demo page)
* Advanced Components include:
  * x-upload
  * x-tree
  * v-ace-editor
  * x-terminal
  * code-mirror
  * x-sound
  * x-code
  * x-code-slot
  * x-markdown
  

## JavaScript Exernal Libraries

These are JavaScript libraries that are used by components or the framework, but they are not Vue components themselves.  These are strictly not required beacuse you can load them through CDN, but I include them in repository for completeness. Goal is to have no external dependencies. I.e, if you have the repository code everything should work (local-first).

These are stored in [js_ext](https://github.com/c0ckp1t/c0ckp1t-webroot/tree/main/js_ext) folder

* required
  * loglevel - logging library
  * vue
  * vue-router
  * vue3-sfc-loader - compiler for Vue Single File Components (SFCs) at runtime
  * idb-keyval-6-2-2.mjs - IndexedDB wrapper
* optional (used by components and lazy loaded)
  * ace - code editor
  * code-mirror - code editor
  * bootstrap.bundle.min.js
  * msgpack - MessagePack implementation for JavaScript
  * moment - date library
  * mitt - event bus
  * json-viewer - JSON viewer for Vue
  * wavesurfer
      * https://github.com/katspaugh/wavesurfer.js
  * xstate
      * https://unpkg.com/xstate@4.38.3/dist
  * rxjs - operators, webSocket, core
  * highlight.min.js - code syntax highlighting
  * markdown-it.min.js - markdown parser 
  * markdownItAnchor - markdown-it plugin to auto create anchors for headings
  * katex.min.js  - math rendering library (LaTeX)
 