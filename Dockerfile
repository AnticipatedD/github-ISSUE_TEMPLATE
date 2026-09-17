# --- Base Dependencies Stage ---
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# --- Development / Test Stage ---
FROM base AS dev
RUN pnpm install --frozen-lockfile
COPY . .
# Runs the vitest test suite inside the container environment
CMD ["pnpm", "test", "--", "--run"]

# --- Production Build Stage ---
FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- Static Production Runner Stage ---
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
