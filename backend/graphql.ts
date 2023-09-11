import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import * as dotenv from "dotenv";
import http from "http";
import bodyParser from "body-parser";
import { initializeApp } from "firebase-admin/app";
import { typeDefs } from "./graphql/index";
import { resolvers } from "./graphql/index";
import mongoose from "mongoose";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  databaseURL: process.env.DATABASE_URL,
  appId: process.env.APP_ID,
};

dotenv.config();
export const firebaseApp = initializeApp(firebaseConfig);

const PORT = parseInt(process.env.PORT || "", 10);
const HOST = process.env.HOST as string;

const app = express();
const httpServer = http.createServer(app);

console.log(resolvers);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(async () => {
  app.use(bodyParser.json(), expressMiddleware(server));

  mongoose
    .connect(process.env.DB_URL as string)
    .then(() => {
      app.listen(PORT, HOST, () => {
        console.log(`🚀 Server ready at http://${HOST}:${PORT}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
