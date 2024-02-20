# TODO: Create user and switch to it
# TODO: For our corporate friends, add an optional step with a custom certificate authority

ARG BASE_IMAGE=python:3.10-slim
FROM ${BASE_IMAGE} as base
WORKDIR /app

COPY requirements/requirements.txt requirements.txt

# HACK: With the current requirements configuration,
#       there is a `file:.` that creeps up in our environment.
#       Since we are install requirements before copying the package
#       we must exclude the "local" package. In any case, we aren't
#       interested for now for an editable install of our project.
#       However, if that is the case, we _could_ defer the installation
#       to later.
# N.B.: For the who like short options, this is equivalent to:
#       grep -v -E -e '^-e'
#       But I think we can all agree it would be too confusing
RUN grep --invert-match --extended-regexp --regexp='^-e' requirements.txt > requirements-clean.txt \
    && pip install --no-cache -r requirements-clean.txt

COPY src/template_mlops_project /app/template_mlops_project

ENTRYPOINT [ "python" ]
CMD [ "-m", "template_mlops_project.something"]