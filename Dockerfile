FROM node:22-alpine AS base

FROM base AS builder
ENV NODE_ENV=production

WORKDIR /app

COPY package*json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm ci --no-progress --loglevel=error --ignore-scripts --include=dev && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN apk add --no-cache gcompat libstdc++ && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono --ingroup nodejs && \
    mkdir -p /app/logs && \
    chown -R hono:nodejs /app

USER hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
