
# Configuration 

## The Config File

All application configuration lives in a **single file**: `config.mjs`.

To configure an app:

1. Copy the shipped template: `cp config.default.mjs config.mjs`
2. Edit `config.mjs` — it contains every option (app settings) plus a
   `config.islands` array for any extra backends.
3. `index.html` imports `config.mjs` and passes it to `apiMain.init()`. Islands
   in `config.islands` are registered automatically by `GlobalStore.init()` — you
   do not add island wiring to `index.html`.

`config.default.mjs` is the pristine reference and lists every option with its
value and a comment. It is a **plain object** — no factory, no merge, no hidden
defaults. What you read is exactly what runs. The nav tree (`root`) and `routes`
are written inline as static literals built from the `instanceId` / `routePrefix`
constants at the top of the file. The only thing pulled from the framework is the
component registry via `defaultVueComponents(componentPrefix)`.

```js
// config.mjs
import { defaultVueComponents, findHostnamePortProtocol } from 'ConfigUtils'

const instanceId      = "default"
const routePrefix     = ""
const componentPrefix = ""
const { hostname, protocol, isSecure } = findHostnamePortProtocol()

export default {
    appName: "My App",
    instanceId,
    type: "IslandDefault",
    appMainComponent: "/core/PageMain.vue",
    // ...every other option, explicit...

    root:   { icon: "fa-house", depth: 0, endpoint: "/", isLeaf: false, isRoot: true, name: "", path: [], children: [ /* ... */ ] },
    routes: [ { path: '/', name: 'root', children: [ /* ... */ ] } ],
    components: defaultVueComponents(componentPrefix),

    islands: [
        { instanceId: "admin", type: "Island",
          connection: { hostname, port: 1995, protocol, endpoint: "socket",
                        username: "root", password: "root", isSecure } },
    ],
}
```

## Required Modules

These core modules are required for the app to run, so they need to be included:

* C0ckp1t Core Modules (required):
    * Logging.mjs
    * GlobalStore.mjs
    * NotifyUtils.mjs
    * VueUtils.mjs
    * JsUtils.mjs
    * WsUtils.mjs
      * msgpack.mjs (52.6 KB)
      * mitt.mjs (0.3 KB ) 
    * ConfigUtils.mjs ( 16.1 KB )
    * IslandDefault.mjs
    * Island.mjs
    * PageMain.vue
* External Libraries (required):
    * vue3-sfc-loader (1,794.1 KB)
    * vue (128.6 KB)
    * vue-router (29.6 KB)

It should download a total of about 2.24 MB. Everything else is optional and lazy loaded.

**Note:** The vue3-sfc-loader will be optional soon. Right now the use cases are for compiling in browser and the 2MB is not a problem.

## index.html Configuration

Anything inside the `index.html` will be loaded immediately. If you want something more lightweight don't include dependencies you won't use.

For example if you are not using fontawesome brand icons don't include the brands.min.css file:

* https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/css/brands.min.css


You can mix and match files including the core modules with your own implementation, this is common if you want to fine-tune the application. For example, you can replace the default `IslandDefault` implementation with your own custom one by replacing the `IslandDefault` location in the `importmap`. It is common is to download and modify it and then serve it from your own server instead of the CDN. For example in your `index.html`:

* "IslandDefault": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/IslandDefault.mjs",

becomes

* "IslandDefault": "./IslandDefault.mjs"

Now you can modify the `IslandDefault.mjs` file as you want.

Notice that in this way you can decide which files to serve locally or remotely.


## The Application 

The main page that determines the layout and contains the `<RouterView/>` element is [PageMain.vue](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/core/PageMain.vue). You can replace it with your own component if you want to customize the app. There is a configuration filed for that:

`appMainComponent: "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.14/core/PageMain.vue"`

See [config.default.mjs](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/config.default.mjs) for the complete, commented list of every configuration option. The framework helpers (`defaultVueComponents`, `validateAppConfig`, `findHostnamePortProtocol`) live in [core/ConfigUtils.mjs](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/core/ConfigUtils.mjs).


