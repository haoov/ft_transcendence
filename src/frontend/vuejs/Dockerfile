#Building the app
FROM node:lts as build-stage

RUN	mkdir -p /app

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install

COPY ./app .

RUN npm run build

#conf nginx
FROM nginx:stable as production-stage

RUN mkdir -p /app

COPY --from=build-stage /app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf