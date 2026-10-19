FROM node:24-bookworm-slim AS build
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts && npm rebuild better-sqlite3 esbuild
COPY . .
RUN npx nuxt prepare && npm run build

FROM node:24-bookworm-slim AS runtime
LABEL org.opencontainers.image.source="https://github.com/daiv05/consolida" \
      org.opencontainers.image.description="Consolida: tracker del plan de inglés A2–B1" \
      org.opencontainers.image.licenses="MIT"
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NUXT_DB_PATH=/data/consolida.db \
    NUXT_MIGRATIONS_DIR=/app/migrations
WORKDIR /app
COPY --from=build --chown=node:node /app/.output ./.output
COPY --chown=node:node server/database/migrations ./migrations
COPY --chown=node:node scripts/backup.mjs ./scripts/backup.mjs
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME ["/data"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["node", ".output/server/index.mjs"]
