import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const source = join(root, "../../../data/catalog.mjs");
const dest = join(root, "../src/data/catalog.seed.mjs");

if (!existsSync(source)) {
  console.warn("[sync-catalog] source missing — using committed catalog.seed.mjs");
  process.exit(0);
}

copyFileSync(source, dest);
console.log("[sync-catalog] copied data/catalog.mjs → src/data/catalog.seed.mjs");
