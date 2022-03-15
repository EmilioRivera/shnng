include ../Makefiles/node.lint.Makefile
include ../Makefiles/npm.utils.Makefile

# Note
# For now, node-related calls will call
# npm run <script> where possible

# Definitions
DOCKER_IMAGE ?= $(shell $(MAKE) get-package-name)
DOCKER_TAG ?= $(shell $(MAKE) get-package-version)
DOCKER_FQIM ?= $(DOCKER_IMAGE):$(DOCKER_TAG)

# Commands
DOCKER ?= docker
NODE ?= node
NPM ?= npm
## TODO: Investigate how we can make this available with the normal installation,
# as it seems that NVM is not loaded in PATH
NVM ?= nvm

# Targets
.PHONY: node-run docker-run

node-run:
	$(NPM) start

node-dev:
	@echo "TODO"

docker-run:
	@echo $(DOCKER) $(DOCKER_ARGS) run --rm -it $(DOCKER_FQIM) $(DOCKER_ENTRYPOINT)

# A custom command showing how we can use jq to get information
.PHONY: list-deps
list-deps: JQ_QUERY = '.dependencies'
list-deps: jq-query
