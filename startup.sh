#!/bin/sh
set -eu

echo "DEBUG: VITE_API_BASE_URL=${VITE_API_BASE_URL}"
echo "DEBUG: VITE_SME_INTEGRACAO_API_BASE_URL=${VITE_SME_INTEGRACAO_API_BASE_URL}"
echo "DEBUG: VITE_SME_INTEGRACAO_API_KEY=${VITE_SME_INTEGRACAO_API_KEY}"

VARIAVEIS_AMBIENTE='${VITE_API_BASE_URL} ${VITE_SME_INTEGRACAO_API_BASE_URL} ${VITE_SME_INTEGRACAO_API_KEY}'

envsubst "${VARIAVEIS_AMBIENTE}" \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

envsubst "${VARIAVEIS_AMBIENTE}" \
  < /usr/share/nginx/html/env.js \
  > /tmp/env.js

mv /tmp/env.js /usr/share/nginx/html/env.js

echo "DEBUG: env.js content after envsubst:"
cat /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'
