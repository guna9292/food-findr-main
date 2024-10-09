#official Node.js image
FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]

# docker run -it --rm --network my-network mongo mongo --host mongodb --port 27017
# docker logs mongodb

# cd E:/anits-assign-guna9292/backend
# docker build -t nagothigunesh/backend-image:latest .
