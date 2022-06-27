FROM node:18-alpine

RUN apk update && apk --no-cache --update add build-base 

WORKDIR /usr/src/app
COPY . .

RUN npm install

# Bundle app source
EXPOSE 8000
CMD [ "node", "dist/index.js" ]
