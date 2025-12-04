# Use official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the project
COPY . .

# Expose Express server port
EXPOSE 3000

# Start the unified app (frontend + backend)
CMD ["npm", "start"]
