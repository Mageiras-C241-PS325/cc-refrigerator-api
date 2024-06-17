# Use the official Node.js image as the base image
FROM node:18

ARG ENV_FILE
ARG FIREBASE_SERVICE_ACCOUNT
ARG GCP_SERVICE_ACCOUNT

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Decode the base64 encoded environment variables and write them to a file
RUN echo "$ENV_FILE" | base64 -d > .env
RUN echo "$FIREBASE_SERVICE_ACCOUNT" | base64 -d > ./src/config/firebaseServiceAccountKey.json
RUN echo "$GCP_SERVICE_ACCOUNT" | base64 -d > ./src/config/gcpServiceAccountKey.json

# For debugging purposes, print the contents of the working directory
RUN ls -la

# Expose the port that the Hapi.js server will run on
EXPOSE 7000

# Define the command to run the application
CMD ["npm", "run", "start"]