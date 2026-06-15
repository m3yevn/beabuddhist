import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDb() {
  if (db) return db;
  const uri = process.env.MONGODB_STRING || "mongodb://127.0.0.1:27017";
  const name = process.env.MONGODB_NAME || "beabuddhist";
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(name);
  return db;
}

export function getDb() {
  if (!db) throw new Error("Database not connected");
  return db;
}
