
# Introduction

**C0ckp1t** is a [Vue.js 3](https://vuejs.org/) zero-build web framework using an Islands architecture. It can compile `.vue` (Single File Components) at runtime via [vue3-sfc-loader](https://github.com/FranckFreiburger/vue3-sfc-loader), this means no Webpack/Vite build step required. It comes with many reusable Vue components and [Bootstrap](https://getbootstrap.com/) is supported with themes provided. There are two islands provided one for HTTP ([IslandDefault.mjs](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/core/IslandDefault.mjs)) and another for WebSocket ([Island.mjs](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/core/Island.mjs)) backends.


## Table of Contents

* [Quick Start](./Quick-Start.md)
* [Configuration](./Configuration.md)
  * C0ckp1t Framework Required JavaScript Modules
  * External Libraries
* [Creating Single File Components (SFCs)](./Creating-SFC.md)
* [Components](./Components.md)
  * [Demo - Bootstrap Components](http://c0ckp1t.com/default/components/basic)
  * [Demo - Vue Components](/default/components/bootstrap) - input, buttons, tables, cards, etc
  * [Demo - Vue Advanced Components](/default/components/advanced) - code editor, audio player, tree view, etc
* [Theming](./Theming.md)
  * [Demo - Theming](/default/components/theme)

## Use CDN

* Examples
  * [index-cdn.html](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/index-cdn.html)

## Use Locally

If you want to use the framework locally, you can download the package from [npm](https://www.npmjs.com/package/c0ckp1t) or do a git clone of the repository. 


**Note:** Check for latest version here: https://registry.npmjs.org/c0ckp1t/

```bash
wget https://registry.npmjs.org/c0ckp1t/-/c0ckp1t-1.0.14.tgz
tar -zxvf c0ckp1t-1.0.14.tgz 

# Note expands to package/ folder 
tar -zxvf c0ckp1t-1.0.2.tgz 
# i.e: 
# package/LICENSE
# package/css/Makefile
# package/js_ext/Makefile
# package/css/bootstrap-c0ckp1t.css
# ...

# To expand to "webroot" directory use this command instead
tar -zxvf c0ckp1t-1.0.2.tgz --strip-components=1 -C webroot
```

## References

* NPM
  * https://www.npmjs.com/package/c0ckp1t
* CDN
  * https://www.jsdelivr.com/package/npm/c0ckp1t
  * https://cdn.jsdelivr.net/npm/c0ckp1t@latest/
* GITHUB
  * https://github.com/lfmunoz/c0ckp1t-webroot/
   