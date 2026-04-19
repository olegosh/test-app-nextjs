# Multi-stage Dockerfile for building individual apps from the monorepo.
# Usage: docker build --build-arg APP_NAME=project-a -t product-portal-a .

ARG NODE_VERSION=22

# ---------- Stage 1: Base ----------
FROM node:${NODE_VERSION}-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
RUN apk add --no-cache libc6-compat

# ---------- Stage 2: Prune monorepo ----------
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@2.5.4
COPY . .
ARG APP_NAME
RUN turbo prune @product-portal/${APP_NAME} --docker

# ---------- Stage 3: Build ----------
FROM base AS builder
WORKDIR /app

# Install dependencies from pruned lockfile
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy pruned source and build
COPY --from=pruner /app/out/full/ .
ARG APP_NAME
RUN pnpm turbo build --filter=@product-portal/${APP_NAME}

# ---------- Stage 4: Production runner ----------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ARG APP_NAME
ARG APP_PORT=3000

# Copy standalone server + static assets
COPY --from=builder /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=builder /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

# Store APP_NAME as env var so CMD can reference it at runtime
ENV APP_NAME=${APP_NAME}
ENV PORT=${APP_PORT}
ENV HOSTNAME="0.0.0.0"

USER nextjs

EXPOSE ${APP_PORT}

CMD node apps/${APP_NAME}/server.js
