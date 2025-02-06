
# Build stage
FROM node:20-alpine3.16 as build

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY . .

# install dependencies
RUN npm install && npm run build

# copy source code
COPY . .

# expose port 8080
EXPOSE 8080

# start app
CMD ["npm", "start"]