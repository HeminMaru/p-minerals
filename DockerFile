# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build your application (if needed)
# RUN npm run build

# Expose the port your application listens on
EXPOSE 3000

# Set environment variables (if needed)
# ENV NODE_ENV=production

# Set the command to run your application
CMD ["npm", "start"]
