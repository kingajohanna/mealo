FROM node:16-alpine

RUN mkdir -p /backend
WORKDIR /backend

COPY . .
RUN source .env

RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "start" ]