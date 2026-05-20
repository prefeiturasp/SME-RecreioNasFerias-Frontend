#!/bin/sh
set -e

npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
npm config set maxsockets 3

attempt=1
max_attempts=3

while [ "$attempt" -le "$max_attempts" ]; do
  echo "npm ci (tentativa $attempt/$max_attempts)..."
  if npm ci; then
    exit 0
  fi
  attempt=$((attempt + 1))
  if [ "$attempt" -le "$max_attempts" ]; then
    echo "Falha de rede. Nova tentativa em 5s..."
    sleep 5
  fi
done

echo "npm ci falhou após $max_attempts tentativas."
exit 1
