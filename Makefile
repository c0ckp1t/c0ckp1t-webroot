
SHELL := /bin/bash
NVM_DIR := $(HOME)/.nvm
NVM := . $(NVM_DIR)/nvm.sh;

.PHONY:  build dev default kitty

# Node.js 18.3 or higher is required for vue 3
default:
	$(NVM) npm --version
	$(NVM) node --version

# ________________________________________________________________________________
# DEVELOPMENT
# ________________________________________________________________________________
dev:
	$(NVM) node ./c0ckp1t-server/src/c0ckp1t-server.mjs 

kitty:
	cd ${PWD} && kitty --detach  --session ${PWD}/kitty.session
