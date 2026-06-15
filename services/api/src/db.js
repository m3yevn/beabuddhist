import { MongoClient } from "mongodb";

let client;
let db;
let connectPromise = null;

const TIMEOUT_MS = 8000;

export async function connectDb() {
  if (db) return db;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const uri = process.env.MONGODB_STRING;
    if (!uri) {
      const err = new Error("MONGODB_STRING not configured");
      err.code = "NOT_CONFIGURED";
      throw err;
    }
    const name = process.env.MONGODB_NAME || "beabuddhist";
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: TIMEOUT_MS,
      connectTimeoutMS: TIMEOUT_MS,
    });
    await client.connect();
    db = client.db(name);
    return db;
  })();

  try {
    return await connectPromise;
  } catch (e) {
    connectPromise = null;
    throw e;
  }
}

export function getDb() {
  if (!db) throw new Error("Database not connected");
  return db;
}

/** Health check — does not throw; used by /health */
export async function pingDb() {
  if (!process.env.MONGODB_STRING) {
    return { ok: false, code: "NOT_CONFIGURED", error: "MONGODB_STRING not set on Vercel" };
  }
  try {
    const database = await connectDb();
    await database.command({ ping: 1 });
    return { ok: true };
  } catch (e) {
    connectPromise = null;
    db = undefined;
    if (client) {
      try {
        await client.close();
      } catch {
        /* ignore */
      }
      client = undefined;
    }
    return { ok: false, code: "CONNECTION_FAILED", error: e.message };
  }
}
