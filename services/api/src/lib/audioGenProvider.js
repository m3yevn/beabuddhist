/**
 * Phase 3 AI — provider interface + governance gate (no generation yet).
 * All outputs must pass validatePackageMetadata before publish.
 */

import { validatePackageMetadata } from "./contentGovernance.js";

/** @typedef {{ id: string, name: string, license: string, enabled: boolean }} AudioGenProviderInfo */

export const PLANNED_PROVIDERS = [
  { id: "musicgen", name: "Meta MusicGen", license: "MIT", enabled: false },
  { id: "bark", name: "Suno Bark (OSS)", license: "MIT", enabled: false },
  { id: "piper", name: "Piper TTS", license: "MIT", enabled: false },
  { id: "procedural", name: "Web Audio procedural", license: "N/A", enabled: false },
];

/**
 * Validate AI-generated package draft before storage.
 * @returns {{ ok: boolean, validation: object, publishable: boolean }}
 */
export function validateAiDraft(pkg) {
  const validation = validatePackageMetadata({
    ...pkg,
    tracks: (pkg.tracks || []).map((t) => ({
      ...t,
      isPlaceholderAudio: false,
      aiGenerated: true,
    })),
  });
  return {
    ok: validation.ok,
    validation,
    publishable: validation.ok && validation.score >= 70,
  };
}

export function getAiPipelineStatus() {
  return {
    phase: 3,
    status: "governance_ready",
    generationEnabled: false,
    providers: PLANNED_PROVIDERS,
    message: "AI generation not enabled. Governance validation endpoint is live.",
  };
}
