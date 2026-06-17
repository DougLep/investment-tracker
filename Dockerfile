FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app files
COPY . .

# Install dev dependencies needed for build
RUN npm install --save-dev vite @vitejs/plugin-react tailwindcss postcss autoprefixer

# Build React app
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
