FROM node:lts

RUN	mkdir -p /api

WORKDIR /api

COPY ./api/package*.json ./

RUN npm install

COPY ./api/* ./

CMD [ "npm", "run", "start:dev" ]