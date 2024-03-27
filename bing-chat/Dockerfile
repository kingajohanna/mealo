FROM node:lts-alpine

RUN mkdir -p /bing-chat
WORKDIR /bing-chat

COPY . .

RUN npm install

CMD [ "npm", "run", "start" ]

EXPOSE 3003