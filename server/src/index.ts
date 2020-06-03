import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const { APP_SECRET, PORT, NODE_ENV } = process.env;

async function start(app: Application, port: number) {
  const db = await connectDatabase();

  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(cookieParser(APP_SECRET));

  if (NODE_ENV === "production") {
    app.use(compression());
    app.use(express.static(`${__dirname}/public`));
    app.get("/*", (_req, res) => res.sendFile(`${__dirname}/public/index.html`));
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res })
  });
  server.applyMiddleware({ app, path: "/api" });

  app.listen(port, async () => {
    console.log(`[app] server running and listening at port: ${port}`)
  });
}

start(express(), parseInt(PORT || "9000", 10));
