import {
  getCachedCategories,
  getCachedPackage,
  getCachedPackages,
  setCachedCategories,
  setCachedPackage,
  setCachedPackages,
} from "./catalogCache";
import { api, type Category, type Package } from "./api";
import { seedCategories, seedPackages } from "./seedCatalog";

export type SearchHit = {
  type: "package" | "track";
  packageId: string;
  packageTitle: string;
  categoryId: string;
  coverEmoji: string;
  trackId?: string;
  trackTitle?: string;
};

function seedIntoCache() {
  setCachedCategories(seedCategories);
  for (const cat of seedCategories) {
    const pkgs = seedPackages.filter((p) => p.categoryId === cat.id);
    setCachedPackages(cat.id, pkgs);
  }
  for (const pkg of seedPackages) {
    setCachedPackage(pkg.id, pkg);
  }
}

/** Load full catalog into cache — seed fallback if API unavailable */
export async function prefetchCatalog(): Promise<void> {
  try {
    const { categories } = await api.categories();
    for (const cat of categories) {
      await api.packages(cat.id);
    }
  } catch {
    if (!getCachedCategories()) seedIntoCache();
  }
}

export function getAllPackages(): Package[] {
  const byId = new Map<string, Package>();
  for (const pkg of seedPackages) byId.set(pkg.id, pkg);

  try {
    const raw = localStorage.getItem("bab_catalog_v1");
    if (raw) {
      const cache = JSON.parse(raw);
      const packagesById = cache.packagesById || {};
      for (const id of Object.keys(packagesById)) {
        byId.set(id, packagesById[id] as Package);
      }
    }
  } catch {
    /* ignore */
  }

  return Array.from(byId.values());
}

export function getCategoriesList(): Category[] {
  return (getCachedCategories<Category[]>() ?? seedCategories).slice().sort((a, b) => a.order - b.order);
}

export function searchCatalog(query: string): SearchHit[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const hits: SearchHit[] = [];
  for (const pkg of getAllPackages()) {
    const pkgMatch =
      pkg.title.toLowerCase().includes(q) ||
      pkg.description?.toLowerCase().includes(q) ||
      pkg.categoryId.toLowerCase().includes(q);

    if (pkgMatch) {
      hits.push({
        type: "package",
        packageId: pkg.id,
        packageTitle: pkg.title,
        categoryId: pkg.categoryId,
        coverEmoji: pkg.coverEmoji,
      });
    }

    for (const track of pkg.tracks || []) {
      if (track.title.toLowerCase().includes(q)) {
        hits.push({
          type: "track",
          packageId: pkg.id,
          packageTitle: pkg.title,
          categoryId: pkg.categoryId,
          coverEmoji: pkg.coverEmoji,
          trackId: track.id,
          trackTitle: track.title,
        });
      }
    }
  }

  return hits;
}

export function getPackageById(id: string): Package | null {
  return getCachedPackage<Package>(id) ?? seedPackages.find((p) => p.id === id) ?? null;
}

export function getPackagesForCategory(categoryId: string): Package[] {
  const cached = getCachedPackages<Package[]>(categoryId);
  if (cached?.length) return cached;
  return seedPackages.filter((p) => p.categoryId === categoryId);
}
