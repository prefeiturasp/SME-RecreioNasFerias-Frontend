#!/bin/sh
set -eu

echo "DEBUG: VITE_API_BASE_URL=${VITE_API_BASE_URL}"
echo "DEBUG: VITE_SME_INTEGRACAO_API_BASE_URL=${VITE_SME_INTEGRACAO_API_BASE_URL}"
echo "DEBUG: VITE_SME_INTEGRACAO_API_KEY=${VITE_SME_INTEGRACAO_API_KEY}"

envsubst \
  '${VITE_API_BASE_URL} ${VITE_SME_INTEGRACAO_API_BASE_URL} ${VITE_SME_INTEGRACAO_API_KEY}' \
  < /usr/share/nginx/html/env.js \
  > /tmp/env.js

mv /tmp/env.js /usr/share/nginx/html/env.js

echo "DEBUG: env.js content after envsubst:"
cat /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'
