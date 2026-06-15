#!/usr/bin/env node
/**
 * Migrate v1 Firestore catalog export → MongoDB v2 schema.
 *
 * Usage:
 *   MONGODB_STRING=... MONGODB_NAME=beabuddhist node scripts/migrate-v1-catalog.js --input ./export.json
 *
 * Input JSON shape (adjust after exporting from Firebase):
 * {
 *   "categories": [{ "id": "...", "title": "...", "order": 1 }],
 *   "packages": [{ "id", "categoryId", "title", "description", "tracks": [...] }]
 * }
 */
import { readFileSync } from "fs";
import { MongoClient } from "mongodb";

const inputFlag = process.argv.indexOf("--input");
if (inputFlag === -1 || !process.argv[inputFlag + 1]) {
  console.error("Usage: node scripts/migrate-v1-catalog.js --input ./export.json");
  process.exit(1);
}

const uri = process.env.MONGODB_STRING;
const name = process.env.MONGODB_NAME || "beabuddhist";
if (!uri) {
  console.error("Set MONGODB_STRING");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(process.argv[inputFlag + 1], "utf8"));
const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(name);

  if (raw.categories?.length) {
    await db.collection("categories").deleteMany({});
    await db.collection("categories").insertMany(raw.categories);
    console.log(`Inserted ${raw.categories.length} categories`);
  }

  if (raw.packages?.length) {
    await db.collection("packages").deleteMany({});
    await db.collection("packages").insertMany(raw.packages);
    console.log(`Inserted ${raw.packages.length} packages`);
  }

  console.log("Migration complete.");
} finally {
  await client.close();
}
