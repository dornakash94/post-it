FROM node:lts-alpine as build
RUN apk update && apk --no-cache --update add build-base 
WORKDIR /usr/post-it/backend
COPY shared ../shared
COPY backend/package.json ./
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm install
RUN npm run build

FROM node:lts-alpine
WORKDIR /usr/post-it/backend
COPY shared ../shared
COPY backend/package.json ./
COPY backend/tsconfig.json ./
RUN npm install
COPY --from=build /usr/post-it/backend/dist ./dist
RUN npm install pm2 -g
EXPOSE 8000
USER node
CMD ["pm2-runtime","dist/index.js"]
