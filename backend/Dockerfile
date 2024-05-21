FROM node:20-alpine

EXPOSE 3000

RUN mkdir -p /backend
WORKDIR /backend

COPY . .

RUN rm -f .env
RUN mv .docker.env .env

RUN source .env

RUN npm install

ENTRYPOINT [ "npm", "run", "dev" ]