FROM node:20-slim

# Install Stockfish (Debian-based)
RUN apt-get update && apt-get install -y stockfish

# Set working directory
WORKDIR /app

# Copy files
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Expose API port
EXPOSE 5000

# Start the API
CMD ["npx","nodemon","--legacy-watch", "app.js"]
