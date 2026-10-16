# syntax=docker/dockerfile:1

# ---- Build: compile the static app -------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- Runtime: nginx serves the app and proxies the news APIs -----------------
# Unprivileged image: runs as a non-root user and listens on 8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

# API keys are injected at container start (envsubst on the template), so they
# never end up in the image or the JavaScript bundle.
ENV NGINX_ENVSUBST_FILTER="^(GUARDIAN|NYT|NEWSAPI)_API_KEY$"
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
