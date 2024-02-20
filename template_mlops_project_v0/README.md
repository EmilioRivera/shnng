# Getting started
## Prerequisites
1. `python -m venv` should work
1. `tox` installed
## Environments

```bash
python -m venv .venv
pip install tox pip-compile-multi
source .venv/bin/activate
```

# Why?
I hate having to open an account somewhere to run something. I strongly prefer running my things locally; while this might sound neurotic it has the advantage of being accessible by everyone.
Various reasons:
1. Data privacy
1. Price
1. Rapidly iterating locally with errors

## Tool selection
`docker-compose` is easier to get in rather than `k8s`.
Requirements are managed with `pip-tools` and `pip-compile-multi`.
`tox` for temp environments for tests
`Makefile` for general command invocations.
## Needing integration
Skaffold + kustomize
mkdocs


# More segregation
You can move out the `infrastructure` folder.
You might be interested in separating the `src/app` and `src/template-mlops-project`


# Use cases to cover
1. XGBoost training
    1. Locally
    1. Distributed
1. User adds a new model