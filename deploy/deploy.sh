#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/consolida"
IMAGE="ghcr.io/daiv05/consolida"
TAG="${SSH_ORIGINAL_COMMAND:-${1:-latest}}"

if [[ ! "$TAG" =~ ^[A-Za-z0-9._-]{1,128}$ ]]; then
  echo "invalid tag: $TAG" >&2
  exit 2
fi

cd "$APP_DIR"

if [ ! -t 0 ]; then
  TOKEN="$(cat)"
  if [ -n "$TOKEN" ]; then
    printf '%s' "$TOKEN" | docker login ghcr.io -u daiv05 --password-stdin >/dev/null
    trap 'docker logout ghcr.io >/dev/null 2>&1 || true' EXIT
  fi
fi

echo "deploying $IMAGE:$TAG"
CONSOLIDA_TAG="$TAG" docker compose pull app
CONSOLIDA_TAG="$TAG" docker compose up -d --remove-orphans app
sed -i "s/^CONSOLIDA_TAG=.*/CONSOLIDA_TAG=$TAG/" .env

for _ in $(seq 1 30); do
  STATUS="$(docker inspect -f '{{.State.Health.Status}}' consolida-app-1 2>/dev/null || echo starting)"
  if [ "$STATUS" = "healthy" ]; then
    echo "healthy"
    docker image prune -f --filter "label=org.opencontainers.image.source=https://github.com/daiv05/consolida" >/dev/null
    exit 0
  fi
  sleep 2
done

echo "container did not become healthy" >&2
docker compose logs --tail 50 app >&2
exit 1
