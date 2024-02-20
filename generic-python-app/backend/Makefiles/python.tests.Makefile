.PHONY: python-test coverage

PYTHON ?= python
PYTEST ?= pytest
PYTHON_COVERAGE ?= coverage
PYTHON_COVERAGE_HTML_PORT ?= 9011
PYTHON_COVERAGE_OUTPUT_DIR ?= htmlcov

# TODO: both these commands should be the same
python-test:
	$(PYTEST)

coverage:
	$(PYTHON_COVERAGE) run -m $(PYTEST)

.PHONY: .coverage-html-report
.coverage-html-report:
	$(PYTHON_COVERAGE) html

.PHONY: view-coverage view-coverage-html
view-coverage:
	$(PYTHON_COVERAGE) report

view-coverage-html: .coverage-html-report
	$(PYTHON) -m http.server $(PYTHON_COVERAGE_HTML_PORT) -d $(PYTHON_COVERAGE_OUTPUT_DIR)
	# sensible-browser localhost:$(PYTHON_COVERAGE_HTML_PORT)
