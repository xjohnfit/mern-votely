FROM node:24.18.0-alpine3.24

WORKDIR /app

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm ci --omit=dev && \
    npm cache clean --force

COPY --chown=nodejs:nodejs src ./src

USER nodejs

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "src/index.js"]
