FROM node:16 as builder
WORKDIR /tmp
COPY package.json package-lock.json tsconfig.json /tmp/
RUN npm ci

COPY src /tmp/src
# TODO: Find a way (maybe 2 steps) to only install prod deps
# Ignore scripts because they are related to linting (dev)
RUN npm run build --ignore-scripts


FROM node:16 as runtime

# Create user running application
RUN mkdir /app && adduser --no-create-home app && chown -R app /app
USER app

WORKDIR /app
# Copy assets from build stage
COPY --from=builder /tmp/node_modules node_modules
COPY --from=builder /tmp/dist dist

# TODO: Remove?
ARG APP_PORT=3000
EXPOSE ${APP_PORT}
# Remember to set WEB_CONCURRENCY to specify number of workers
CMD ["node", "dist/index.js"]
