SHELL := /bin/bash
SDKMAN_INIT_SCRIPT := $(HOME)/.nvm/nvm.sh

DIAGRAMS := module-dependecy state-management app-shell \
 connection-lifecycle file-resolution rpc-patterns island-architecture \
 overview application-flow


# dark, light, forest, neutral, default
# -b transparent
png:
	source ${SDKMAN_INIT_SCRIPT} && \
	for diagram in $(DIAGRAMS); do \
		mmdc -i $$diagram.mmd -o $$diagram.png  --theme forest -w 1200 -H 800 --scale 2; \
	done