# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# For debugging purposes, print the contents of the working directory
RUN ls -la

# Expose the port that the Hapi.js server will run on
EXPOSE 7000

# Define the command to run the application
CMD ["npm", "run", "start"]