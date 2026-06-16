/**
 * Content Integrity Layer (player) — mirrors services/api/src/lib/contentGovernance.js
 */

export const FORBIDDEN_GENRES = new Set([
  "electronic dance music", "edm", "electro house", "house", "club", "dubstep",
  "techno", "trance", "drum and bass", "dnb", "hip hop", "trap", "metal", "punk",
]);

export const ALLOWED_GENRES_BY_TYPE: Record<string, string[]> = {
  chant: ["traditional", "pali", "sanskrit", "theravada", "mahayana", "devotional", "acapella", "temple chant"],
  meditation: ["guided", "mindfulness", "ambient", "breathing", "loving-kindness", "body scan"],
  dharma: ["teaching", "lecture", "discussion", "study", "dharma talk"],
  instrumental: ["temple ambience", "nature sounds", "meditation music", "singing bowls", "soft instrumental"],
  learning: ["beginner", "history", "philosophy", "study material", "introductory"],
};

export function validateGenreForContent(genre: string, contentType: string): boolean {
  const g = genre.toLowerCase().trim();
  if (FORBIDDEN_GENRES.has(g)) return false;
  const allowed = ALLOWED_GENRES_BY_TYPE[contentType];
  if (!allowed) return true;
  return allowed.some((a) => g.includes(a) || a.includes(g));
}

export function contentIntegrityLabel(pkg: { isPlaceholderAudio?: boolean; contentType?: string; genre?: string }) {
  if (pkg.isPlaceholderAudio) return "Demo audio — licensed recordings coming soon";
  return null;
}
