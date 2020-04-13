import { MongoClient } from "mongodb";

const dbUser = "user";
const dbUserPwd = "password";
const dbCluster = "cluster";

const url = `mongodb+srv://${dbUser}:${dbUserPwd}@${dbCluster}.mongodb.net/test?retryWrites=true&w=majority`;

export async function connectDatabase() {
  const client = await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true}
  );

  const db = client.db("tinyhouse-main");

  return {
    listings: db.collection("test-listings")
  };
}
