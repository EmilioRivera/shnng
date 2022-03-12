POETRY ?= poetry

.PHONY: requirements.txt dev-requirements.txt

requirements.txt:
	$(POETRY) export --without-hashes -f requirements.txt --output $@

dev-requirements.txt:
	$(POETRY) export --without-hashes --dev -f requirements.txt --output $@
