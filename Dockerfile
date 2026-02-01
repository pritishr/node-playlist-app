# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source
COPY src ./src

# ---------- Stage 2: Runtime ----------
FROM node:18-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy from builder
COPY --from=builder /app /app

# Change ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]
