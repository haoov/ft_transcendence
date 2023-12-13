#Building the app
FROM node:lts as build-stage

RUN	mkdir -p /app

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install

COPY ./app .

RUN npm run build

# conf nginx
FROM nginx:stable as production-stage

RUN mkdir -p /app

COPY --from=build-stage /app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf


# FROM alpine:3

# RUN apk update && apk upgrade

# RUN	mkdir -p /app

# WORKDIR /app

# COPY ./app/package*.json ./

# RUN npm install

# COPY ./app .

# RUN npm run build

# #Nginx
# RUN apk add nginx -y

# COPY --from=build-stage /app/dist /.
# COPY nginx.conf /etc/nginx/nginx.conf

# CMD ["nginx", "-g", "daemon on"]
# ENTRYPOINT ["npm", "run", "dev"]