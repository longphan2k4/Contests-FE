# Step 1: Use an official Node.js image as build environment
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies
RUN rm -rf node_modules package-lock.json && npm install

# Copy all source files
COPY . .

# Build the app using Vite
RUN npm run build -- --mode production

# Step 2: Use nginx to serve the static build
FROM nginx:stable-alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy default nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
