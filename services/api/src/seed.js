import { configDotenv } from "dotenv";
import { connectDb } from "./db.js";
import { seedCatalogIfEmpty } from "./services/store.js";

configDotenv();

await connectDb();
await seedCatalogIfEmpty();
console.log("Catalog seeded (skipped if already present).");
