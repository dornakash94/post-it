FROM node:lts-alpine

RUN apk update && apk --no-cache --update add build-base 

WORKDIR /usr/src/app
COPY . .

RUN npm install


USER node
EXPOSE 8000
CMD [ "node", "dist/index.js" ]
