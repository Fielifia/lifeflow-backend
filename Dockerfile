# --- Base ---
FROM node:lts-bookworm-slim AS base
WORKDIR /usr/src/app
COPY package*.json ./

# --- Dev ---
FROM base AS development
RUN npm install
COPY . .
CMD ["sh", "-c", "sleep 3 && node src/scripts/seedIfEmpty.js || true && npm run dev"]

# --- Deps ---
FROM base AS deps
RUN npm ci --omit=dev

# --- Prod ---
FROM node:lts-bookworm-slim AS production
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "node src/scripts/seedIfEmpty.js || true && node src/server.js"]
