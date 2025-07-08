# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy workspace files
COPY libs/ ./libs/
COPY apps/web/ ./apps/web/

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build --workspace=@fixelo/web

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Change to the correct working directory
WORKDIR /app/apps/web

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"] 