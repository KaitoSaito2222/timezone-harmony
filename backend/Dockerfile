# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma.config.ts ./
COPY prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "set -x && npx prisma migrate deploy 2>&1 || (echo 'Migration failed with exit code:' $? && exit 1) && node dist/src/main.js"]
