include ../Makefiles/poetry.Makefile
include ../Makefiles/python.lint.Makefile
include ../Makefiles/python.tests.Makefile
include ../Makefiles/python.fastapi.Makefile

# Definitions
FASTAPI_APP = $(PYTHON_APP).run:app

PYTHON_APP ::= app
DOCKER_IMAGE ?= $(PYTHON_APP)
DOCKER_TAG ?= latest
DOCKER_FQIM ?= $(DOCKER_IMAGE):$(DOCKER_TAG)

# Commands
UVICORN ?= uvicorn
DOCKER ?= docker
PYTHON ?= python

# Targets
.PHONY: python-run docker-run

python-run:
	$(UVICORN) $(FASTAPI_APP)

docker-run:
	@echo $(DOCKER) $(DOCKER_ARGS) run --rm -it $(DOCKER_FQIM) $(DOCKER_ENTRYPOINT-)

.PHONY: python-dev
python-dev:
	$(UVICORN) --reload $(FASTAPI_APP)


