FROM node:lts

RUN	mkdir -p /app

WORKDIR /app

COPY ./api/package*.json ./

RUN npm install

COPY ./api/* ./

CMD [ "npm", "run", "start:dev" ]