# Use the official Node.js 16 as a parent image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Your application listens on port 3000
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]
