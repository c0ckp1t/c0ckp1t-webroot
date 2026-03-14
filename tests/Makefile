SHELL := /bin/bash
NVM_DIR := $(HOME)/.nvm
NVM := . $(NVM_DIR)/nvm.sh;


.PHONY:   default test test-single

# Node.js 18.3 or higher is required for vue 3
default:
	$(NVM) npm --version
	$(NVM) node --version


test:
	$(NVM) npx vitest run ./src


test-single:
	 $(NVM) npx vitest run ./src/DocUtils.test.mjs
	#$(NVM) npx vitest run ./src/JsUtils.test.mjs
