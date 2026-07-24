# ---- Stage 1: build the React frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: install server dependencies (bcrypt needs a build toolchain) ----
FROM node:20-alpine AS server-deps
WORKDIR /app/server
RUN apk add --no-cache python3 make g++
COPY server/package*.json ./
RUN npm ci --omit=dev

# ---- Stage 3: final runtime image ----
FROM node:20-alpine
WORKDIR /app/server

COPY --from=server-deps /app/server/node_modules ./node_modules
COPY server/ ./
COPY --from=frontend-build /app/frontend/dist ../frontend/dist

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "index.js"]
