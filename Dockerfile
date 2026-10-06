FROM node:24-alpine AS base

RUN apk add --no-cache libc6-compat

ENV PNPM_HOME=/pnpm \
    npm_config_store_dir=/pnpm/store \
    NEXT_TELEMETRY_DISABLED=1

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


# -------------------------
# Dependencies
# -------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile


    

# -------------------------
# Build
# -------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

RUN pnpm exec prisma generate

RUN pnpm build

FROM builder AS migrator
CMD ["pnpm", "exec", "prisma", "migrate", "deploy", "--config", "prisma7.config.ts"]


# -------------------------
# Production
# -------------------------
FROM node:24-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public

COPY --from=builder --chown=node:node /app/.next/standalone ./

COPY --from=builder --chown=node:node /app/.next/static ./.next/static

COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node

EXPOSE 3000

CMD ["node", "server.js"]