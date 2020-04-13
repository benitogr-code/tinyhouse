import { MongoClient } from "mongodb";
import { Database } from "../lib/types";

const dbUser = "user";
const dbUserPwd = "password";
const dbCluster = "cluster";

const url = `mongodb+srv://${dbUser}:${dbUserPwd}@${dbCluster}.mongodb.net/test?retryWrites=true&w=majority`;

export async function connectDatabase(): Promise<Database> {
  const client = await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true}
  );

  const db = client.db("tinyhouse-main");

  return {
    listings: db.collection("test-listings")
  };
}
