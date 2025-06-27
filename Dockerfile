# Multi-stage build for React + Vite application

# Stage 1: Build the application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Copy production environment file as .env
COPY .env.prod .env

# Build the application
RUN yarn build

# Stage 2: Serve the application with nginx
FROM nginx:alpine AS production

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create optimized nginx configuration for SPA + Chat App
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    client_max_body_size 20M; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Gzip compression \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json; \
    \
    # Static files caching \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # API endpoints \
    location /api/ { \
        proxy_pass http://chat-chit-server:36363; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        \
        # WebSocket support \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        \
        # Timeout settings \
        proxy_connect_timeout 60s; \
        proxy_send_timeout 60s; \
        proxy_read_timeout 60s; \
    } \
    \
    # Socket.IO endpoint \
    location /socket.io/ { \
        proxy_pass http://chat-chit-server:36363; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        \
        # Socket.IO specific settings \
        proxy_buffering off; \
        proxy_connect_timeout 60s; \
        proxy_send_timeout 60s; \
        proxy_read_timeout 60s; \
    } \
    \
    # SPA routing - must be last \
    location / { \
        try_files $uri $uri/ /index.html; \
        \
        # Security headers \
        add_header X-Frame-Options "SAMEORIGIN" always; \
        add_header X-Content-Type-Options "nosniff" always; \
        add_header X-XSS-Protection "1; mode=block" always; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]