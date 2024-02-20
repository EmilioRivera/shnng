.PHONY: lint fmt

NPM ?= npm

lint:
	$(NPM) run eslint

fmt:
	$(NPM) run eslint -- --fix
