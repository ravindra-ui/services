FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm cache clear --force
RUN npm install
COPY . .
EXPOSE 3000
EXPOSE 4200
CMD [ "npm", "start" ]
