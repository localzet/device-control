FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY index.js ./
COPY includes/ ./includes/
COPY assets/ ./assets/

# Create data directory
RUN mkdir -p /app/data

# Expose ports
EXPOSE 22533 22222

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:22533/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run application
CMD ["node", "index.js"]

