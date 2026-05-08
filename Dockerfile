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
RUN npm ci --omit=dev --ignore-scripts

# --- Prod ---
FROM node:lts-bookworm-slim AS production
WORKDIR /usr/src/app

COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

ENV NODE_ENV=production
EXPOSE 5000

USER node

CMD ["sh", "-c", "node src/scripts/seedIfEmpty.js || true && node src/server.js"]
