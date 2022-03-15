.PHONY: get-package-name get-package-version jq-query

JQ ?= jq
JQ_ARGS += --raw-output

# Default to the file package.json in the current directory (of the caller)
PACKAGE_JSON ?= package.json

jq-query:
	@$(JQ) $(JQ_ARGS) $(JQ_QUERY) $(PACKAGE_JSON)

get-package-name: JQ_QUERY ::= '.name'
get-package-name: jq-query

get-package-version: JQ_QUERY ::= '.version'
get-package-version: jq-query
