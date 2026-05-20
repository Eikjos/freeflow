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
ENV PATH="$PNPM_HOME:$PNPM_HOME/bin:$PATH"
RUN pnpm config set global-bin-dir /pnpm/bin

RUN pnpm add -g turbo@2.7.5
COPY . .
# Add lockfile and package.json's of isolated subworkspace
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN turbo prune api --docker
#COPY apps/api/prisma /app/out/full/apps/api/prisma
# ---
FROM base AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
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
COPY --from=builder /app .
RUN mkdir -p /app/uploads && chown 777 /app/uploads

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV UPLOADED_FILE=/app/uploads
EXPOSE 8080

CMD sh -c ' \
  [ -f /run/secrets/DB_PASSWORD ] && export DB_PASSWORD=$(cat /run/secrets/DB_PASSWORD | tr -d "\r\n"); \
  [ -f /run/secrets/SECRET_JWT ] && export SECRET_JWT=$(cat /run/secrets/SECRET_JWT | tr -d "\r\n"); \
  [ -f /run/secrets/JWT_REFRESH_SECRET ] && export JWT_REFRESH_SECRET=$(cat /run/secrets/JWT_REFRESH_SECRET | tr -d "\r\n"); \
  [ -f /run/secrets/INSEE_API_KEY ] && export INSEE_API_KEY=$(cat /run/secrets/INSEE_API_KEY | tr -d "\r\n"); \
  [ -f /run/secrets/SMTP_PASSWORD ] && export SMTP_PASSWORD=$(cat /run/secrets/SMTP_PASSWORD | tr -d "\r\n"); \
  \
  export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public&connection_limit=10"; \
  \
  node apps/api/dist/src/main.js \
'


