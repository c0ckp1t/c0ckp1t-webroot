
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


