# ---- Stage 1: install full dependencies (incl. dev) for the build step ----
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Stage 2: build the TypeScript output ----
FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Stage 3: minimal runtime image (production deps only, non-root) ----
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user to run the app
RUN addgroup -S app && adduser -S app -G app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output
COPY --from=build /app/dist ./dist

# Hand ownership over to the non-root user
RUN chown -R app:app /app
USER app

EXPOSE 3000
CMD ["node", "dist/index.js"]
