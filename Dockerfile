FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN browserify  ./public/javascripts/graph.js -o ./public/javascripts/bundle.js

COPY . .

EXPOSE 3000
CMD npm start