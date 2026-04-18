
# C0ckp1t — A Zero-Build Vue.js Framework

**C0ckp1t** is a [Vue.js 3](https://vuejs.org/) zero-build web framework using an Islands architecture. It can compile `.vue` (Single File Components) at runtime via [vue3-sfc-loader](https://github.com/FranckFreiburger/vue3-sfc-loader), this means no Webpack/Vite build step required. It comes with many reusable Vue components and [Bootstrap](https://getbootstrap.com/) is supported with themes provided. There are two islands provided one for HTTP ([IslandDefault.mjs](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/core/IslandDefault.mjs)) and another for WebSocket ([Island.mjs](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/core/Island.mjs)) backends.

--- 

## Table of Contents

* [Getting Started](./Getting-Started.md)
* [Architecture](./Architecture.md)
* [Configuration](./Configuration.md)
  * C0ckp1t Framework Required JavaScript Modules
  * External Libraries
* [Creating Single File Components (SFCs)](./Creating-SFC.md)
* [Components](./Components.md)
  * [Demo - Bootstrap Components](:/default/components/basic)
  * [Demo - Vue Components](:/default/components/bootstrap) - input, buttons, tables, cards, etc
  * [Demo - Vue Advanced Components](:/default/components/advanced) - code editor, audio player, tree view, etc
* [Theming](./Theming.md)
  * [Demo - Theming](:/default/components/theme)
* [Contributing](./CONTRIBUTING.md)

--- 

## Quick Start

<details class="mb-2">
<summary><strong>Option 1: Use the CDN (Fastest)</strong></summary>

No installation required. Create an `index.html` that references C0ckp1t from the CDN:

* See the full example at: [index-cdn.html](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/index-cdn.html)
* [Quick Start](./Quick-Start.md) - Minimum Live Demo
* Explore the CDN package: [jsdelivr.com/package/npm/c0ckp1t](https://www.jsdelivr.com/package/npm/c0ckp1t)

</details>

<details class="mb-2">
<summary><strong>Option 2: Install Locally (Recommended for Production)</strong></summary>

```bash
# Download the latest package from npm
wget https://registry.npmjs.org/c0ckp1t/-/c0ckp1t-1.0.14.tgz
tar -zxvf c0ckp1t-1.0.19.tgz 

# Warning: expands to package/ folder 
tar -zxvf c0ckp1t-1.0.19.tgz 
# i.e: 
# package/LICENSE
# package/css/Makefile
# package/js_ext/Makefile
# package/css/bootstrap-c0ckp1t.css
# ...

# To expand to "webroot" directory use this command instead
mkdir -p webroot
tar -zxvf c0ckp1t-1.0.19.tgz --strip-components=1 -C webroot
```

Check for the latest version: [npmjs.com/package/c0ckp1t](https://www.npmjs.com/package/c0ckp1t)

</details>

<details class="mb-2">
<summary><strong>Option 3: Clone the Repository</strong></summary>

```bash
git clone https://github.com/c0ckp1t/c0ckp1t-webroot.git
cd c0ckp1t-webroot
# Serve with any static file server and start building
```

</details>

--- 

## Links & Resources

| Resource | URL |
|---|---|
| **NPM** | [npmjs.com/package/c0ckp1t](https://www.npmjs.com/package/c0ckp1t) |
| **CDN** | [cdn.jsdelivr.net/npm/c0ckp1t@latest/](https://cdn.jsdelivr.net/npm/c0ckp1t@latest/) |
| **GitHub** | [github.com/c0ckp1t/c0ckp1t-webroot](https://github.com/c0ckp1t/c0ckp1t-webroot) |
