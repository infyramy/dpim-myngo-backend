# Use Node.js 18 Alpine image for smaller size
FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 myngo

# Change ownership of the app directory
RUN chown -R myngo:nodejs /app
USER myngo

# Expose port 3000 as required
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').request('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).end()"

# Start the application
CMD ["npm", "start"] 