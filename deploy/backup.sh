#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/consolida"
DEST="/backups/consolida"
KEEP_DAYS=14
NAME="consolida-$(date +%Y%m%d-%H%M%S).db"

mkdir -p "$DEST"
cd "$APP_DIR"
docker compose exec -T app node scripts/backup.mjs "/data/backups/$NAME" >/dev/null
docker compose cp "app:/data/backups/$NAME" "$DEST/$NAME"
docker compose exec -T app rm -f "/data/backups/$NAME"
gzip -f "$DEST/$NAME"
find "$DEST" -name 'consolida-*.db.gz' -mtime +"$KEEP_DAYS" -delete
echo "$(date -Is) backup $DEST/$NAME.gz"
