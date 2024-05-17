#!/bin/sh

envsubst < /public.config.dist/env-config.js > /usr/share/nginx/html/config/env-config.js
envsubst < /public.config.dist/keycloak.json > /usr/share/nginx/html/config/keycloak.json
nginx -g "daemon off;"
