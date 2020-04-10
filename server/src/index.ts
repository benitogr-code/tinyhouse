import { ApolloServer } from "apollo-server-express";
import express from "express";
import { schema } from "./graphql";

const port = 9000;
const app = express();

const server = new ApolloServer({ schema });
server.applyMiddleware({ app, path: "/api" });

app.listen(port, () => {
  console.log(`[app] server running http://localhost:${port}`)
});
