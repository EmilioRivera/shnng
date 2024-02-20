.PHONY: lint fmt

BLACK ?= black
ISORT ?= isort

lint:
	@echo "== Checking format with black"
	$(BLACK) $(if $(VERBOSE),-v,) --check $(PYTHON_APP)
	@echo "== Checking sorting order with isort"
	$(ISORT) --check-only $(PYTHON_APP)

fmt:
	$(BLACK) $(if $(VERBOSE),-v,) $(PYTHON_APP)
	$(ISORT) $(PYTHON_APP)