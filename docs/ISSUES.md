
# Issues 


## Lazy Loading

Island should be lazy loaded. Right now it is pulling Connection. Which pulls rxjs


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


