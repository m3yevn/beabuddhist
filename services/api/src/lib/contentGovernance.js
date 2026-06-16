/**
 * Content Integrity Layer — validates spiritual/educational audio metadata
 * before catalog publish or AI generation output is stored.
 */

export const CATALOG_VERSION = 2;

/** Genres that must never appear on chant, dharma, or meditation content */
export const FORBIDDEN_GENRES = new Set([
  "electronic dance music",
  "edm",
  "electro house",
  "house",
  "club",
  "dubstep",
  "techno",
  "trance",
  "drum and bass",
  "dnb",
  "hip hop",
  "trap",
  "metal",
  "punk",
  "disco",
  "funk",
]);

/** Allowed genres per content type */
export const ALLOWED_GENRES_BY_TYPE = {
  chant: [
    "traditional",
    "pali",
    "sanskrit",
    "theravada",
    "mahayana",
    "devotional",
    "acapella",
    "temple chant",
    "recitation",
  ],
  meditation: [
    "guided",
    "mindfulness",
    "ambient",
    "breathing",
    "loving-kindness",
    "body scan",
    "contemplative",
  ],
  dharma: [
    "teaching",
    "lecture",
    "discussion",
    "study",
    "dharma talk",
    "sutra reading",
  ],
  instrumental: [
    "temple ambience",
    "nature sounds",
    "meditation music",
    "traditional instruments",
    "singing bowls",
    "soft instrumental",
  ],
  learning: [
    "beginner",
    "history",
    "philosophy",
    "study material",
    "introductory",
  ],
};

const MOOD_BY_TYPE = {
  chant: ["calm", "reverent", "focused", "devotional"],
  meditation: ["calm", "peaceful", "gentle", "grounded"],
  dharma: ["reflective", "clear", "contemplative"],
  instrumental: ["ambient", "spacious", "soft"],
  learning: ["curious", "clear", "welcoming"],
};

function normalizeGenre(genre) {
  return String(genre || "")
    .trim()
    .toLowerCase();
}

/**
 * @returns {{ ok: boolean, score: number, errors: string[], warnings: string[] }}
 */
export function validateTrackMetadata(track, context = {}) {
  const errors = [];
  const warnings = [];
  let score = 100;

  const contentType = context.contentType || track.contentType;
  const genre = normalizeGenre(track.genre || context.genre);
  const title = track.title || "";

  if (!title.trim()) {
    errors.push("Track title is required.");
    score -= 40;
  }

  if (genre && FORBIDDEN_GENRES.has(genre)) {
    errors.push(`Forbidden genre "${genre}" for spiritual content.`);
    score -= 50;
  }

  if (contentType && genre) {
    const allowed = ALLOWED_GENRES_BY_TYPE[contentType];
    if (allowed && !allowed.some((g) => genre.includes(g) || g.includes(genre))) {
      warnings.push(`Genre "${genre}" is unusual for content type "${contentType}".`);
      score -= 15;
    }
  }

  if (track.isPlaceholderAudio) {
    warnings.push("Placeholder audio — replace with licensed recording before production.");
    score -= 10;
  }

  if (!track.audioUrl) {
    errors.push("audioUrl is required.");
    score -= 30;
  }

  return { ok: errors.length === 0, score: Math.max(0, score), errors, warnings };
}

/**
 * @returns {{ ok: boolean, score: number, errors: string[], warnings: string[] }}
 */
export function validatePackageMetadata(pkg) {
  const errors = [];
  const warnings = [];
  let score = 100;

  if (!pkg.title?.trim()) {
    errors.push("Package title is required.");
    score -= 30;
  }

  if (!pkg.contentType) {
    warnings.push("contentType missing — assign chant, meditation, dharma, instrumental, or learning.");
    score -= 10;
  }

  const pkgGenre = normalizeGenre(pkg.genre);
  if (pkgGenre && FORBIDDEN_GENRES.has(pkgGenre)) {
    errors.push(`Forbidden genre "${pkgGenre}" on package "${pkg.title}".`);
    score -= 50;
  }

  for (const track of pkg.tracks || []) {
    const result = validateTrackMetadata(track, {
      contentType: pkg.contentType,
      genre: track.genre || pkg.genre,
    });
    errors.push(...result.errors.map((e) => `${pkg.title} / ${track.title}: ${e}`));
    warnings.push(...result.warnings.map((w) => `${pkg.title} / ${track.title}: ${w}`));
    score = Math.min(score, result.score);
  }

  return { ok: errors.length === 0, score: Math.max(0, score), errors, warnings };
}

/** Validate entire catalog — used at API seed and pre-publish */
export function validateCatalog(packages) {
  const results = packages.map((pkg) => ({
    packageId: pkg.id,
    ...validatePackageMetadata(pkg),
  }));
  const failed = results.filter((r) => !r.ok);
  const minScore = results.length ? Math.min(...results.map((r) => r.score)) : 100;
  return {
    ok: failed.length === 0,
    minScore,
    packages: results.length,
    failed: failed.length,
    results,
  };
}

/** Score content for recommendations (higher = safer to surface) */
export function recommendationScore(pkg) {
  const validation = validatePackageMetadata(pkg);
  let score = validation.score;
  if (pkg.isFeatured) score += 5;
  if (pkg.creatorId) score += 3;
  if (!pkg.isPlaceholderAudio) score += 10;
  return Math.min(100, score);
}

export function suggestMoods(contentType) {
  return MOOD_BY_TYPE[contentType] || MOOD_BY_TYPE.meditation;
}
