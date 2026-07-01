# Base image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Environment
ENV NODE_ENV=production

# Expose API port
EXPOSE 5001

# Start the application
CMD ["npm", "start"]