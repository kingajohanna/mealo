FROM node:lts-alpine

RUN mkdir -p /backend
WORKDIR /backend

COPY . .
RUN source .env

RUN npm install

CMD [ "npm", "run", "start" ]

EXPOSE 3000