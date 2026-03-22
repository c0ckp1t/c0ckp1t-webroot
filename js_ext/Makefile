

vue-production:
	ln -s vue.esm-browser.prod.min.js vue.js

vue-development:
	ln -s vue.esm-browser.min.js vue.js

vue3-sfc-loader-map:
	# wget https://cdn.jsdelivr.net/npm/vue3-sfc-loader@0.9.5/dist/vue3-sfc-loader.esm.js
	# wget https://cdn.jsdelivr.net/npm/vue3-sfc-loader@0.9.5/dist/vue3-sfc-loader.js
	wget https://app.unpkg.com/vue3-sfc-loader@0.9.5/files/dist/vue3-sfc-loader.esm.js.map
	#wget https://cdn.jsdelivr.net/npm/vue3-sfc-loader@0.9.5/dist/vue3-sfc-loader.js.map
	#wget https://cdn.jsdelivr.net/npm/vue3-sfc-loader@0.9.5/dist/vue3-sfc-loader.esm.js.map



# https://github.com/katspaugh/wavesurfer.js
# https://www.jsdelivr.com/package/npm/wavesurfer.js
wavesurfer:
	wget https://cdn.jsdelivr.net/npm/wavesurfer.js@7.12.1/dist/wavesurfer.esm.js

# note: c0ckp1t originally uses  "1.11.2";
# latest is exports.version = "1.43.6";  as of 2026 January
# 907.55 kB
ace-editor:
	ln -s /src-noconflict ./ace-editor

vue3-sfc-loader:
	ln -s /home/ellis/github/vue3-sfc-loader ./vue3-sfc-loader


# rxjs	Core observables, Subject, of, from, merge, etc. (49K)
# rxjs/operators	Pipeable operators (map, filter, switchMap, etc.) (41K)
# rxjs/webSocket	webSocket() factory and WebSocketSubject (11K)
.PHONY: rxjs
rxjs:
	wget -O rxjs.esm.mjs "https://esm.sh/rxjs@7.8.1/es2022/rxjs.bundle.mjs"
	wget -O rxjs-webSocket.esm.mjs "https://esm.sh/rxjs@7.8.1/es2022/webSocket.bundle.mjs"
	wget -O rxjs-operators.esm.mjs "https://esm.sh/rxjs@7.8.1/es2022/operators.bundle.mjs"
