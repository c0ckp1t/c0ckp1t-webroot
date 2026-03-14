# C0ckp1t Frontend

This project is a Vue.js 3 zero-build web framework using an Islands architecture. HTTP and WebSocket backends are supported. It can compile .vue SFC files at runtime via **vue3-sfc-loader**, this means no Webpack/Vite build step required. There are many reusable components and bootstrap 5.3 theming.


## References

* npm
  * https://www.npmjs.com/package/c0ckp1t
* cdn
  * https://www.jsdelivr.com/package/npm/c0ckp1t
  * https://cdn.jsdelivr.net/npm/c0ckp1t@latest/

## Overview

The main entry point is `GlobalStore.mjs`. You initialize it with a configuration object, and name of where the C0ckp1t Vue Application should be mounted. 

```js
import Constants from 'C0ckp1tAppConfig'

import {api as apiMain} from 'GlobalStore'
apiMain.init("app-default", Constants)
```


## jsfiddle.net example



## Use Remotely (jsdelivr CDN)



## Use Locally


```bash
wget https://registry.npmjs.org/c0ckp1t/-/c0ckp1t-1.0.2.tgz
tar -zxvf c0ckp1t-1.0.2.tgz 

# Note expands to  package/ folder i.e:
tar -zxvf c0ckp1t-1.0.2.tgz 
# package/LICENSE
# package/css/Makefile
# package/js_ext/Makefile
# package/css/bootstrap-c0ckp1t.css
# ...

# to expand to webroot directory
tar -zxvf c0ckp1t-1.0.2.tgz --strip-components=1 -C webroot
```


## Releases

* 1.0.12 - Beta: fixing cdn index-cdn.html making sure it works with jsfiddle.net
  * Had to publish many times to get CDN working with different configurations
* 1.0.2 - Beta: fixing cdn index-cdn.html example
* 1.0.1 - Beta: removing `Constants.mjs` dependencies
* 1.0.0 - Beta: initial release 
