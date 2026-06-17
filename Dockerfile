FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm ci

# Copy app files
COPY . .

# Build React app
RUN npm run build

# Clean up dev dependencies (optional, saves space)
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
