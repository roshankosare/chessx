# Use a stable Node.js version
FROM node:22 AS builder
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Remove any previous node_modules (ensures clean install)
RUN rm -rf node_modules

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the entire project after dependencies are installed
COPY . .

# Run set-local-ip.cjs if necessary
# Build the project
RUN npm run build

# --- Serve with Nginx ---
FROM nginx:alpine

# Copy built files from Node.js stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
