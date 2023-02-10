# FROM node:17-alpine

# #you need to do this because When using the node:17-alpine image as the base image for your Docker container, the image does not include the nodemon module globally. 
# RUN npm install -g nodemon

# WORKDIR /app
# COPY package.json package.json
# COPY package-lock.json package-lock.json
# RUN npm install
# COPY . . 
# CMD ["nodemon", "index.js"]

FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the SSL certificate files into the container
COPY certificate.crt /app/certificate.crt
COPY private.key /app/private.key
COPY ca_bundle.crt /app/ca_bundle.crt

# Set environment variables for the certificate files
ENV SSL_CERTIFICATE_FILE /app/certificate.crt
ENV SSL_PRIVATE_KEY_FILE /app/private.key
ENV SSL_CA_BUNDLE_FILE /app/ca_bundle.crt

# Copy the remaining files from the host to the container
COPY . .

# Install the app's dependencies
RUN npm install

# Start the app
CMD ["npm", "start"]