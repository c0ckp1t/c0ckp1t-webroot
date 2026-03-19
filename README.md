# C0ckp1t Frontend

This project is a Vue.js 3 zero-build web framework using an Islands architecture. HTTP and WebSocket backends are supported. It can compile .vue SFC files at runtime via **vue3-sfc-loader**, this means no Webpack/Vite build step required. There are many reusable components and bootstrap 5.3 theming.

## References

* NPM
  * https://www.npmjs.com/package/c0ckp1t
* CDN
  * https://www.jsdelivr.com/package/npm/c0ckp1t
  * https://cdn.jsdelivr.net/npm/c0ckp1t@latest/
* GITHUB
  * https://github.com/lfmunoz/c0ckp1t-webroot/


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

## Configuration

The main entry point is `GlobalStore.mjs`. You initialize it with a configuration object, and name of where the C0ckp1t Vue Application should be mounted.

```js
import Constants from 'C0ckp1tAppConfig'

import {api as apiMain} from 'GlobalStore'
apiMain.init("app-default", Constants)
```

## Releases

* 1.1.0 - Initial Release
* 1.0.XX - Anything before 1.1.0 is "pre-release" development and testing.
