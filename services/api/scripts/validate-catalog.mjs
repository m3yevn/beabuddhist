import { packages } from "../src/data/catalog.js";
import { validateCatalog, CATALOG_VERSION } from "../src/lib/contentGovernance.js";

const result = validateCatalog(packages);
const placeholders = packages.reduce(
  (n, p) => n + p.tracks.filter((t) => t.isPlaceholderAudio).length,
  0
);

console.log(`[validate:catalog] version=${CATALOG_VERSION} packages=${packages.length} tracks=${placeholders} placeholders`);
console.log(`[validate:catalog] ok=${result.ok} minScore=${result.minScore} failed=${result.failed}`);

if (!result.ok) {
  for (const r of result.results.filter((x) => !x.ok)) {
    console.error(`  ✗ ${r.packageId}:`, r.errors);
  }
  process.exit(1);
}

if (placeholders > 0) {
  console.warn(`[validate:catalog] ${placeholders} tracks still use placeholder audio (see LICENSED_AUDIO.md)`);
}

console.log("[validate:catalog] passed");
