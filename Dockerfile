# FROM node:24-alpine AS base
# RUN apk add --no-cache libc6-compat
# ENV PNPM_HOME=/pnpm \
#     npm_config_store_dir=/pnpm/store \
#     NEXT_TELEMETRY_DISABLED=1 \
#     PATH="/pnpm:$PATH"
# RUN corepack enable
# WORKDIR /app

# # ---------- deps ----------
# FROM base AS deps
# COPY package.json pnpm-lock.yaml ./
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
#     pnpm install --frozen-lockfile

# # ---------- builder ----------
# FROM base AS builder
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
# RUN pnpm exec prisma generate --config prisma7.config.ts
# RUN pnpm build

# # ---------- runner ----------
# FROM node:24-alpine AS runner
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# ENV NODE_ENV=production \
#     NEXT_TELEMETRY_DISABLED=1 \
#     PORT=3000 \
#     HOSTNAME=0.0.0.0

# # Next.js standalone
# COPY --from=builder --chown=node:node /app/public ./public
# COPY --from=builder --chown=node:node /app/.next/standalone ./
# COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# # ⬇️ YE STEP ZAROORI — standalone ka node_modules hatao
# # RUN rm -rf ./node_modules

# COPY --from=builder --chown=node:node /app/node_modules ./node_modules
# COPY --from=builder --chown=node:node /app/prisma ./prisma
# COPY --from=builder --chown=node:node /app/prisma7.config.ts ./prisma7.config.ts
# COPY --from=builder --chown=node:node /app/src ./src
# COPY --from=builder --chown=node:node /app/tsconfig.json ./tsconfig.json


# USER node
# EXPOSE 3000

# CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy --config prisma7.config.ts && node server.js"]


FROM node:24-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME=/pnpm npm_config_store_dir=/pnpm/cache NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/cache \
    pnpm install --frozen-lockfile

FROM deps AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN pnpm exec prisma generate --config prisma7.config.ts
RUN pnpm build

FROM node:24-slim AS runner

WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production PORT=3000 NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && pnpm add -g prisma

COPY --from=builder --chown=node:node  /app/public ./public
COPY --from=builder  --chown=node:node /app/.next/standalone ./
COPY --from=builder  --chown=node:node /app/.next/static ./.next/static


COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma7.config.ts ./prisma7.config.ts


USER node
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy --config prisma7.config.ts && node server.js"]


