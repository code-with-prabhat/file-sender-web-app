FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Make sure uploads directory exists with .gitkeep
RUN mkdir -p uploads && touch uploads/.gitkeep

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"] 