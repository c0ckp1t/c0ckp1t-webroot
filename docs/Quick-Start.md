
# Quick Start


To get started look at the [examples](https://github.com/c0ckp1t/c0ckp1t-webroot/tree/main/examples) folder of the git repository. The simplest example is in the minimum folder.

Live demo: https://c0ckp1t.com/examples/minimum
 
You can just copy the `index.html` and the `PageMain.vue` file and serve them from a static file server, the entire framework is delivered through a CDN. 

The main entry point is [GlobalStore.mjs](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/core/GlobalStore.mjs). You initialize it with a configuration object, and name of the HTML element where the **C0ckp1t Vue Application** should be mounted.

```js
import {init as initLogger} from 'Logging';
import {api as apiMain} from 'GlobalStore'
import { createConfig } from 'https://cdn.jsdelivr.net/npm/c0ckp1t@latest/Config.mjs'
const config = createConfig({
  appEndpoint: "https://cdn.jsdelivr.net/npm/c0ckp1t@latest",
  routePrefix: "https://cdn.jsdelivr.net/npm/c0ckp1t@latest",
  componentPrefix: "https://cdn.jsdelivr.net/npm/c0ckp1t@latest",
  appMainComponent: "https://cdn.jsdelivr.net/npm/c0ckp1t@latest/core/PageMain.vue",
  defaultLoggerLevels: {
    "VueUtils.mjs": "INFO"
  }
})
initLogger(config)
await apiMain.init("app-default", config)
```

See [Configuration](./Configuration.md) for more details on the configuration options (i.e, to add your own pages).