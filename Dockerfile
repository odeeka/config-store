FROM node:24-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src src
CMD ["npm", "run", "dev"]

FROM node:24-alpine AS prod-dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM gcr.io/distroless/nodejs24-debian12 AS production
WORKDIR /app
COPY --from=prod-dependencies /app/node_modules ./node_modules
COPY src src
CMD ["src/index.js"]
