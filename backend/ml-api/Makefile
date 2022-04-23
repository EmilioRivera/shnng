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

DOCKER_RUNTIME_PORT=8001

# Commands
UVICORN ?= uvicorn
DOCKER ?= docker
PYTHON ?= python

# Targets
.PHONY: python-run docker-run

python-run:
	$(UVICORN) $(FASTAPI_APP)

docker-run:
	$(DOCKER) $(DOCKER_ARGS) run --rm -it -p $(DOCKER_RUNTIME_PORT):$(DOCKER_RUNTIME_PORT) $(DOCKER_FQIM) $(DOCKER_ENTRYPOINT-)

.PHONY: python-dev
python-dev:
	$(UVICORN) --reload $(FASTAPI_APP)

.PHONY: docker-build
docker-build:
	DOCKER_BUILKIT=1 $(DOCKER) build . --build-arg APP_PORT=$(DOCKER_RUNTIME_PORT) -t $(DOCKER_FQIM)

