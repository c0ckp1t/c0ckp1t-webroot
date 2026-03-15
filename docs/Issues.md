
# Known Issues


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

