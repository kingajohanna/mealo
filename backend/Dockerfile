FROM node:18-alpine

RUN mkdir -p /backend
WORKDIR /backend

COPY . .
RUN source .env

ENV LANG C.UTF-8

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]