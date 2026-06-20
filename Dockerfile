FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY server.js .
COPY index.html .

EXPOSE 3000

CMD ["node", "server.js"]
