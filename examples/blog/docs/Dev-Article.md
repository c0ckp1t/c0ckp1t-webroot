
# Article - Development



```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>C0ckp1t</title>
  <link rel="icon" href="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/favicon-32x32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/favicon-64x64.png" sizes="64x64" type="image/png">
  <link rel="icon" href="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/favicon-192x192.png" sizes="192x192" type="image/png">

  <link href="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/css/bootstrap.min.css"  type="text/css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/css/fontawesome/solid.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/css/fontawesome/fontawesome.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/highlight/stackoverflow-dark.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/markdown/katex.min.css">
  <link href="./style.css"  type="text/css" rel="stylesheet">

  <script type="importmap">
    {
        "imports": {
            "Logging": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/Logging.mjs",
            "GlobalStore": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/GlobalStore.mjs",
            "NotifyUtils": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/notify/NotifyUtils.mjs",
            "VueUtils": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/VueUtils.mjs",
            "JsUtils": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/JsUtils.mjs",
            "WsUtils": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/WsUtils.mjs",
            "CoreUtils": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/CoreUtils.mjs",

            "IslandDefault": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/IslandDefault.mjs",
            "Island": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/Island.mjs",

            "vue3-sfc-loader": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/vue3-sfc-loader.esm.js",
            "vue": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/vue.esm-browser.prod.min.js",
            "vue-router": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/vue-router.esm-browser.prod.js",

            "idb-keyval": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/idb-keyval-6.2.2.mjs",
            "wavesurfer": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/wavesurfer.esm.mjs",
            "mitt": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/mitt.mjs",
            "msgpack": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/msgpack.mjs",
            "xstate": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/xstate.web.mjs",
            "json-viewer": "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/json-viewer.bundle.js"
        }
    }
  </script>

</head>

<body class="main-body">
<div id="app-default">
  <app-main></app-main>
</div>
</body>

<!-- =================== SCRIPTS ===================  -->
<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/loglevel.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/loglevel-plugin-prefix.min.js"></script>

<script type="module">
  import {init as initLogger} from 'Logging';
  import {api as apiMain} from 'GlobalStore'
  import { createConfig } from 'https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/Config.mjs'

  const config = createConfig({
    appEndpoint: "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13",
    appName: "Blog Demo",
    routePrefix: "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13",
    componentPrefix: "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13",
    appMainComponent: "/demos/blog/PageMain.vue",
    //navCloseLogo: "/demos/blog/img/logo_v1.svg",
    //navOpenLogo: "/demos/blog/img/logo_v1.svg",
    navHasSearch: false,
    navHasThemeSel: true,
    routes: [
      { path: '/', location: "./Main.vue" },
      {path: '/docs', redirect: `/docs/Introduction.md`},
      {path: '/docs/:pathMatch(.*)*', location: `https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/core/pages/Documentation.vue`},
    ],
  })
  initLogger(config)
  await apiMain.init("app-default", config)

</script>

<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/highlight/highlight.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/markdown/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/markdown/markdown-it.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/markdown/markdownItAnchor.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/rxjs.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/moment.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.13/js_ext/ace-editor/ace.js" type="text/javascript" charset="utf-8"></script>
</html>
```
