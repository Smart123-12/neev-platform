# ── Stage 1: Build React app ─────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy all source (including .env so Vite can read keys at build time)
COPY . .

# Build production bundle — Vite reads .env automatically
RUN npm run build

# ── Stage 2: Serve with nginx ─────────────────
FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
