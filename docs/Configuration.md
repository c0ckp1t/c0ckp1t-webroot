
# Configuration 

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

See [DEFAULTS](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/52eb14195d5d0f9c8d75c96463d696e161599a2d/core/CoreUtils.mjs#L44) for a complete list of all the configuration options. Also see 
[Config](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/Config.mjs) to understand how components and routes are registered.


