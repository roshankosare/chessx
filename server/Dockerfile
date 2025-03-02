# Use Node.js Alpine for smaller image size
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy the rest of the app files
COPY . .

# Run build
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm install --production

# Expose server port
EXPOSE 5000

# Start the server
CMD ["node", "dist/main"]
