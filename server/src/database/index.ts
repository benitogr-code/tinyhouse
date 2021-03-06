import { MongoClient } from "mongodb";
import { Database, Booking, Listing, User } from "../lib/types";

function getConnectionUrl(): string {
  const { DB_USER, DB_USER_PWD, DB_CLUSTER } = process.env;

  return `mongodb+srv://${DB_USER}:${DB_USER_PWD}@${DB_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`;
}

export async function connectDatabase(): Promise<Database> {
  const url = getConnectionUrl();
  const client = await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true}
  );

  const db = client.db("tinyhouse-main");

  return {
    bookings: db.collection<Booking>("bookings"),
    listings: db.collection<Listing>("listings"),
    users: db.collection<User>("users")
  };
}
