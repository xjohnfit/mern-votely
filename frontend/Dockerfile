# Build stage
FROM node:24.18.0-alpine3.24 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001

COPY --chown=nginx-app:nginx-app nginx.conf /etc/nginx/nginx.conf

COPY --from=builder --chown=nginx-app:nginx-app /app/dist /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx /var/log/nginx /tmp && \
    chown -R nginx-app:nginx-app /var/cache/nginx /var/log/nginx /tmp /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /tmp /usr/share/nginx/html

USER nginx-app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["nginx", "-g", "daemon off;"]
