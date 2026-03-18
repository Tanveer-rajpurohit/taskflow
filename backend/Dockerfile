FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Install ALL deps (cached if package files don't change)
RUN npm install

# Copy source and config
COPY tsconfig.json ./
COPY src ./src

# Build the project
RUN npx tsc --project tsconfig.json


FROM node:20-alpine AS runtime

# Security: non-root user for production
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs expressuser

WORKDIR /app

COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy only the compiled output
COPY --from=builder /app/dist ./dist

RUN chown -R expressuser:nodejs /app

USER expressuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "dist/index.js"]