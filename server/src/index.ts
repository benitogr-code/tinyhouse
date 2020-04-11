import { ApolloServer } from "apollo-server-express";
import express from "express";
import { typeDefs, resolvers } from "./graphql";

const port = 9000;
const app = express();

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/api" });

app.listen(port, () => {
  console.log(`[app] server running http://localhost:${port}`)
});
