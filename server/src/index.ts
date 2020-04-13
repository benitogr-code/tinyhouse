import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const APP_PORT = 9000;

async function start(app: Application, port: number) {
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db })
  });
  server.applyMiddleware({ app, path: "/api" });

  app.listen(port, async () => {
    console.log(`[app] server running http://localhost:${port}`)
  });
}

start(express(), APP_PORT);
