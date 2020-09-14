FROM node:12-alpine

# Create an app directory
WORKDIR /usr/src/app

# A wildcard to ensure both package.json and package-lock.json is copied.
COPY package*.json ./

# Install dependencies
RUN npm install 

# Bundle app source
COPY . .

# Environment variable
ENV PORT=8080

# Exposing a port
EXPOSE 8080

CMD ["node", "Server.js"]


