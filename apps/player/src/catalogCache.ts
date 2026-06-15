const CACHE_KEY = "bab_catalog_v1";

type CatalogCache = {
  categories?: unknown;
  packages?: Record<string, unknown>;
  packagesById?: Record<string, unknown>;
  savedAt: number;
};

function readCache(): CatalogCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(patch: Partial<CatalogCache>) {
  const prev = readCache() || { savedAt: 0, packages: {}, packagesById: {} };
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ ...prev, ...patch, savedAt: Date.now() })
  );
}

export function getCachedCategories<T>(): T | null {
  return (readCache()?.categories as T) ?? null;
}

export function getCachedPackages<T>(categoryId: string): T | null {
  return (readCache()?.packages?.[categoryId] as T) ?? null;
}

export function getCachedPackage<T>(id: string): T | null {
  return (readCache()?.packagesById?.[id] as T) ?? null;
}

export function setCachedCategories(data: unknown) {
  writeCache({ categories: data });
}

export function setCachedPackages(categoryId: string, data: unknown) {
  const c = readCache() || { savedAt: 0, packages: {}, packagesById: {} };
  const packages = { ...c.packages, [categoryId]: data };
  writeCache({ packages });
}

export function setCachedPackage(id: string, data: unknown) {
  const c = readCache() || { savedAt: 0, packages: {}, packagesById: {} };
  const packagesById = { ...c.packagesById, [id]: data };
  writeCache({ packagesById });
}

export function isCatalogCacheFresh(maxAgeMs = 1000 * 60 * 60 * 24) {
  const c = readCache();
  if (!c?.savedAt) return false;
  return Date.now() - c.savedAt < maxAgeMs;
}
