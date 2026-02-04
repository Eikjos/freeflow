# -------------------------
# STAGE 0: Builder (common)
# -------------------------
FROM node:24-alpine AS base

WORKDIR /app

RUN npm install -g pnpm

FROM base AS prepare
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm add -g turbo@2.7.5
COPY . .
# Add lockfile and package.json's of isolated subworkspace
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN turbo prune api --docker
#COPY apps/api/prisma /app/out/full/apps/api/prisma
# ---
FROM base AS builder
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN pnpm install
# Build the project
COPY --from=prepare /app/out/full/ .
RUN cd apps/api && npx prisma generate
RUN cd apps/api && pnpm run copy-scripts
RUN pnpm turbo build --filter=api


FROM node:24-alpine AS api

WORKDIR /app
# Copier build API et packages nécessaires
COPY --from=builder /app .

ENV NODE_ENV=production
EXPOSE 8080

CMD  ["sh", "-c", "cd apps/api && npx prisma migrate deploy && node dist/src/main.js"]


