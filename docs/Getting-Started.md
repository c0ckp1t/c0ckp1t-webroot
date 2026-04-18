
# Getting Started

To get started look at the [examples](https://github.com/c0ckp1t/c0ckp1t-webroot/tree/main/examples) folder of the git repository. The simplest example is in the **minimum** folder.

* Minimum live demo: 
  * https://c0ckp1t.com/examples/minimum
* Repository:
  * https://github.com/c0ckp1t/c0ckp1t-webroot/tree/main/examples/minimum
 
You can copy the `index.html` and the `PageMain.vue` file and serve them from a static file server, the entire framework is delivered through a CDN (except for those two files). You can download any file and serve it locally if you want (or serve all the files locally). The framework should be self-contained and not require any compilation (unless you want to optimize). 

## Configuration

The main entry point is [GlobalStore.mjs](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/core/GlobalStore.mjs). You initialize it with a configuration object, and name of the HTML element where the **C0ckp1t Vue Application** should be mounted.


```html
<body class="main-body">
    <div id="app-default" >
      <app-main></app-main>
    </div>
</body>
```

```html
<script type="module">
import {init as initLogger} from 'Logging'; // specified in importmap
import {api as apiMain} from 'GlobalStore' // specified in importmap
// Helper to create configuration object with default values
import { createConfig } from 'https://cdn.jsdelivr.net/npm/c0ckp1t@latest/Config.mjs'
// Configuration Object
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
</script>
```

See [Configuration](./Configuration.md) for more details on the configuration options (i.e, to add your own pages).