
# Issues 


## Lazy Loading

Can WsUtils be lazy-loaded?

WsUtils is used in moduleCache 
WsUtils is in the browser import map so import("WsUtils") will resolve correctly
vue3-sfc-loader supports promises in moduleCache — this is already proven by the lazyModules pattern for json-viewer, idb-keyval, mitt, etc.

1. Remove the static import from VueUtils
import * as WsUtils from "WsUtils";
2. Remove WsUtils from the eagerly-set moduleCache object
   WsUtils: WsUtils,  // remove this line
3. Add 'WsUtils' to the lazyModules array at line 171:
   const lazyModules = ['WsUtils', 'json-viewer', 'idb-keyval', 'mitt', 'wavesurfer', 'msgpack', 'xstate']

This could be future improvement, but right now WsUtils also has Http. Need to more cleanly separate before making changes. 

WsUtils needs refactoring for sure.

## Plan: Lazy-load vue3-sfc-loader

Plan: Lazy-load vue3-sfc-loader

Problem
vue3-sfc-loader is imported statically at the top of VueUtils.mjs (line 19), meaning the entire heavy library is parsed and executed on every page load — even when SFC compilation is never needed.
Solution

Replace the static import with a lazy import() that only triggers when loadModule is first called.

Changes needed (all in VueUtils.mjs):

1. Remove the static import on line 19:
   import {loadModule, vueVersion} from 'vue3-sfc-loader'

2. Add a lazy-loading helper (singleton pattern):
   let _sfcLoader = null
   async function getSfcLoader() {
   if (!_sfcLoader) {
   _sfcLoader = import('vue3-sfc-loader')
   _sfcLoader = await _sfcLoader
   logger.info(`vue3-sfc-loader vue version ${_sfcLoader.vueVersion}`)
   }
   return _sfcLoader
   }

3. Update loadModuleFromText() (line 206) — await the loader before calling it:
   const { loadModule } = await getSfcLoader()
   return await loadModule(virtualPath, textOptions)

4. Replace the re-exported loadModule (line 293) with a wrapper function:
   export async function sfcLoadModule(path, opts) {
   const { loadModule } = await getSfcLoader()
   return loadModule(path, opts)
   }

5. Update GlobalStore.mjs line 10 and line 193 — change the import from loadModule to sfcLoadModule and update the call. Since GlobalStore.mjs already wraps it in an async function (api.loadModule at line 190), this is a trivial change.
6. Remove the eager vueVersion log on line 39 — it moves into getSfcLoader() so it fires on first use instead.



## Theming 

I created the `Theme.vue` and `Theme.mjs` with Opus 4.6. It is pretty much AI slop (but it works).
It needs to be cleaned up. 


## Loading SVG issues 

(or likely same issue with any image)

In a SFC

:src="../assets/loading.svg"
does not work

but
src="../assets/loading.svg"
does work.

This means
when it is a variable it doesn't go through VueUtils for some reason


# Improvements

## Switching islands

When switching islands it would be great to call a function in the island to perform actions against the global store. This includes changing the nav bar and the footer and the title. perhaps even the theme.


## Support Pre-Comiled SFCs

Compiled PageMain.vue -> PageMain.compiled.mjs

A compiled SFC is just a regular JS module that exports a Vue component object with a render function.

The browser can load it with a native import() — no vue3-sfc-loader needed.

Before starting the app, run a script that reads .vue files and outputs compiled .mjs files


For components/ — all 35 .vue files get compiled and concatenated into a single bundle file like dist/components.mjs that exports every component:

```js
// dist/components.mjs (auto-generated)
import { ref, computed, ... } from 'vue'
// --- xcard.vue ---
const _xcard_render = (_ctx, _cache) => { /* compiled template */ }
const xcard = { setup() { /* ... */ }, render: _xcard_render }
// --- xinput.vue ---
const _xinput_render = (_ctx, _cache) => { /* compiled template */ }
const xinput = { setup() { /* ... */ }, render: _xinput_render }

// ... all other components ...
export { xcard, xinput, xtabs, /* ... */ }
 ```


The options.moduleCache already supports pre-populated entries. You could inject pre-compiled components directly into it before the app starts, and vue3-sfc-loader would skip fetching/compiling them entirely (it checks the cache first)


leaf components are ideal candidates for a single-file bundle



# Supporting Absolut LInks in nav router

Turn it into a beforeEnter guard 
```js
if (route.redirect && /^https?:\/\//.test(route.redirect)) {
const externalUrl = route.redirect;
transformedRoute.beforeEnter = () => {
window.location.href = externalUrl;
};
} else if (route.redirect !== undefined) {
transformedRoute.redirect = route.redirect;
}

 ```