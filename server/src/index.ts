import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const { PORT } = process.env;

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

    //const listings = await db.listings.find({}).toArray();
    //console.log(listings);
  });
}

start(express(), parseInt(PORT || "9000", 10));
