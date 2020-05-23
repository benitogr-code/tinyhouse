import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const { APP_SECRET, PORT } = process.env;

async function start(app: Application, port: number) {
  const db = await connectDatabase();

  app.use(bodyParser({ limit: "2mb" }));
  app.use(cookieParser(APP_SECRET));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res })
  });
  server.applyMiddleware({ app, path: "/api" });

  app.listen(port, async () => {
    console.log(`[app] server running http://localhost:${port}`)

    //const listings = await db.listings.find({}).toArray();
    //console.log(listings);
  });
}

start(express(), parseInt(PORT || "9000", 10));
