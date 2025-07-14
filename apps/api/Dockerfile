# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy workspace files
COPY libs/ ./libs/
COPY apps/api/ ./apps/api/

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate --schema=libs/prisma/prisma/schema.prisma

# Build the application
RUN npm run build --workspace=@fixelo/api

# Remove devDependencies after build
RUN npm prune --production

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy built application and all necessary files
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/libs ./libs
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./root-package.json
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Expose port
EXPOSE 3001

# Switch to non-root user
USER nestjs

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/apps/api/src/main.js"] 