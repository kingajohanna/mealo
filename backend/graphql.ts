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
import { authenticateToken } from "./src/middlewares/auth";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY as string,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
  databaseURL: process.env.FIREBASE_DATABASE_URL as string,
  appId: process.env.FIREBASE_APP_ID as string,
};

export const firebaseApp = initializeApp(firebaseConfig);

const PORT = parseInt(process.env.PORT || "", 10);
const HOST = process.env.HOST as string;

const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(async () => {
  app.use(authenticateToken);
  app.use("/graphql", (req, res, next) => {
    console.log("Context:", req.res?.locals.uid, res?.locals.uid); // Log the context
    next();
  });
  app.use(
    "/graphql",
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        uid: res?.locals.uid,
        email: res?.locals.email,
      }),
    })
  );

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
