# Simple production image
FROM node:20-alpine

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* .npmrc* ./
RUN npm install --omit=dev

# Copy source
COPY . .

# Environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "server.js"]
