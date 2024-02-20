# Make sure this version is the same one you use to dev/make tests
FROM python:3.8-slim as builder

RUN python -m venv /pyvenv
ENV PATH="/pyvenv/bin:$PATH"
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.8-slim as runtime
# This is the LOCAL directory relateive to this microservice
ARG APP_DIR="app"
ARG APP_PORT=8001
COPY --from=builder /pyvenv /pyvenv

RUN mkdir /app && adduser --no-create-home app && chown -R app /app
USER app
WORKDIR /app

# We want: /WORKDIR/app/run.py
COPY --chown=app:app ${APP_DIR} app

ENV PATH="/pyvenv/bin:$PATH"
EXPOSE ${APP_PORT}
ENV UVICORN_PORT=${APP_PORT}
# Remember to set WEB_CONCURRENCY to specify number of workers
CMD ["uvicorn", "app.run:app", "--host", "0.0.0.0"]
