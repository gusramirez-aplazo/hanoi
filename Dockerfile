FROM node:22-alpine AS base

ARG NODE_ENV=development
ARG HONO_APP_PORT=3000
ARG HONO_CORS_ORIGIN

FROM base AS builder
ENV NODE_ENV=${NODE_ENV}
ENV HONO_APP_PORT=${HONO_APP_PORT}
ENV HONO_CORS_ORIGIN=${HONO_CORS_ORIGIN}

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

EXPOSE ${HONO_APP_PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${HONO_APP_PORT}/health || exit 1

CMD ["node", "dist/index.js"]
