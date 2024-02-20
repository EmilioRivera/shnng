TOX ?= tox
PIP_COMPILE_MULTI ?= pip-compile-multi
DOCKER ?= docker

.DEFAULT: help
.PHONY: help

help:
	@echo "TODO: Explain what todo"

##############################################
# COMMON DEFINITIONS
# ------------
#
##############################################
PACKAGE_PATH := src/template_mlops_project
PROJECT_NAME ::= template-mlops-project
PY_PROJECT_NAME ::= $(subst -,_,$(PROJECT_NAME))
TESTS_PATH := tests

##############################################
# MAIN TARGETS
# ------------
# Commands users are expected to run often
##############################################
.PHONY: style-check style-fix lint-check lint-fix
style-check:
	$(TOX) -e beauty exec -- black --verbose --check $(PACKAGE_PATH) $(TESTS_PATH)

style-fix:
	$(TOX) -e beauty exec -- black $(PACKAGE_PATH) $(TESTS_PATH)

lint-check:
	$(TOX) -e beauty exec -- ruff check $(PACKAGE_PATH) $(TESTS_PATH)

lint-fix:
	$(TOX) -e beauty exec -- ruff --fix $(PACKAGE_PATH) $(TESTS_PATH)

.PHONY: test
test:
	$(TOX) -e test

.PHONY: docker-build
docker-build:
	$(DOCKER) build -t $(PY_PROJECT_NAME) .


##############################################
# UTILITY TARGETS
# --------------
#
##############################################
# TODO: Create or modify the .vscode config
.PHONY: generate-local-setup update-requirements launch-jupyter-lab

generate-local-setup:
	$(TOX) -e ide

update-requirements:
	$(PIP_COMPILE_MULTI)

# TODO: Make sure the environment is installed before
launch-jupyter-lab: TOX_IDE_PYTHON ?= $(shell tox c -e ide | grep -E '^env_python' | cut -d= -f 2)
launch-jupyter-lab:
	$(TOX_IDE_PYTHON) -m jupyter lab