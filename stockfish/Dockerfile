FROM node:20-slim

# Set working directory
WORKDIR /app

# Install Stockfish efficiently
RUN apt-get update && \
    apt-get install -y --no-install-recommends stockfish && \
    rm -rf /var/lib/apt/lists/*

# Copy package files separately to leverage caching
COPY package.json package-lock.json ./

# Ensure dotenv is installed
ENV NODE_ENV=production

# Install dependencies (including dotenv if needed)
RUN npm install

# Copy remaining files
COPY . .

# Use a non-root user for security
RUN useradd --no-create-home nodeuser && chown -R nodeuser /app
USER nodeuser

# Expose API port
EXPOSE 5123

# Start the API
CMD ["node", "app.js"]
