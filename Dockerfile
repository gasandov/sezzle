# =============================================================================
# Stage 1 — Frontend Builder
# =============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --ignore-scripts

COPY frontend/ ./
RUN npm run build

# =============================================================================
# Stage 2 — Backend Builder
# =============================================================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --ignore-scripts

COPY backend/ ./
RUN npm run build

# =============================================================================
# Stage 3 — Runner (lean Alpine image)
# =============================================================================
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Copy compiled backend
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy built frontend assets into the backend's static public folder
COPY --from=frontend-builder /app/frontend/dist ./dist/public

EXPOSE 3000

CMD ["node", "dist/server.js"]
