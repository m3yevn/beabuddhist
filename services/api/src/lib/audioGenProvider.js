/**
 * Phase 3 AI — provider interface + governance gate.
 * All outputs must pass validatePackageMetadata before publish.
 */

import { validatePackageMetadata } from "./contentGovernance.js";

/** @typedef {{ id: string, name: string, license: string, enabled: boolean }} AudioGenProviderInfo */

export const PLANNED_PROVIDERS = [
  { id: "musicgen", name: "Meta MusicGen", license: "MIT", enabled: false },
  { id: "bark", name: "Suno Bark (OSS)", license: "MIT", enabled: false },
  { id: "piper", name: "Piper TTS", license: "MIT", enabled: false },
  { id: "procedural", name: "Web Audio procedural", license: "N/A", enabled: true },
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

/**
 * Build a governed ambient package draft (Web Audio params — client renders).
 */
export function generateProceduralAmbient({ title, contentType = "instrumental", mood = "calm", durationSec = 300 }) {
  const draft = {
    id: `ai-ambient-${Date.now()}`,
    title: title || "Procedural temple ambience",
    contentType,
    genre: "temple ambience",
    tradition: "Universal",
    coverEmoji: "✨",
    description: "AI-generated procedural ambient session (Web Audio).",
    isPlaceholderAudio: false,
    aiGenerated: true,
    tracks: [
      {
        id: "ambient-main",
        title: title || "Ambient session",
        audioUrl: "procedural://web-audio",
        durationSec,
        genre: "temple ambience",
        mood,
        isPlaceholderAudio: false,
        aiGenerated: true,
        procedural: {
          provider: "procedural",
          oscillators: [
            { type: "sine", freqHz: 174, gain: 0.08 },
            { type: "triangle", freqHz: 261.63, gain: 0.05 },
          ],
          filter: { type: "lowpass", frequency: 800 },
        },
      },
    ],
  };

  const result = validateAiDraft(draft);
  return { ...result, draft };
}

export function getAiPipelineStatus() {
  return {
    phase: 3,
    status: "procedural_preview",
    generationEnabled: true,
    providers: PLANNED_PROVIDERS.map((p) =>
      p.id === "procedural" ? { ...p, enabled: true, mode: "spec-only" } : p
    ),
    message: "Procedural ambient spec generation enabled. MusicGen/Bark still gated.",
  };
}
