FROM node:20-alpine

RUN mkdir -p /backend
WORKDIR /backend

COPY . .
RUN source .env

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]