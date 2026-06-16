# Be A Buddhist AI Pipeline Audit

> Investigation date: 2026-06-17

---

## Finding: AI generation is **not implemented**

There is **no runtime AI pipeline** in the Be A Buddhist codebase. Phase 3 is specification and documentation only.

---

## Evidence

| Search term | Code result |
|-------------|-------------|
| `openai` | Not in source — docs explicitly say “no OpenAI bills” |
| `replicate` | Not found |
| `suno` (API) | Not found — docs reference open-source **Bark**, not Suno API |
| `MusicGen` | Docs only (`apps/web/src/pages/docs/ai.astro`) |
| `generations` collection | Planned in `REBIRTH.md`, not in `store.js` |
| `AudioGenProvider` | Interface in docs, no `.ts` implementation |

---

## Documented Phase 3 plan

Source: `apps/web/src/pages/docs/ai.astro`, `REBIRTH.md`

| Provider | Intended use | License |
|----------|--------------|---------|
| Meta MusicGen (AudioCraft) | Ambient beds, chant loop extension | MIT |
| Suno **Bark** (OSS) | Chanting-style vocals | MIT |
| Piper TTS | Guided intros | MIT |
| Stable Audio Open | Short ambient | Open weights |
| Hugging Face Inference | Hosted demos | Free tier |
| Procedural (Web Audio) | Offline fallback | $0 |

**Rejected:** Paid Suno API, OpenAI billing.

### Example prompts (docs only)

- `"soft temple bells, 20 minute meditation ambient, no drums"`
- `"20 min metta, soft temple bells, Myanmar style"`

---

## Reported “Pali chant + Electro House” — actual cause

**Not AI genre hallucination.** v1 catalog used SoundHelix URLs:

```
Three Refuges → soundhelix.com/.../SoundHelix-Song-4.mp3
```

SoundHelix generates **demo electronic instrumentals**. Titles said “chant”; audio was unrelated placeholder music. No genre assignment code existed.

---

## Genre assignment (current)

- **v1:** None — only `categoryId`
- **v2:** Explicit `genre` + `contentType` on packages/tracks, validated by `contentGovernance.js`

---

## Recommendations for Phase 3 AI

1. Implement `AudioGenProvider` interface with swappable backends
2. Run **all** AI output through `validatePackageMetadata()` before publish
3. Label AI content in UI (`aiGenerated: true`)
4. Separate “Monastery-reviewed catalog” from “AI soundscapes” collection
5. Log `generations` documents: `prompt`, `model`, `validationScore`, `published`
6. Never auto-assign genres from model defaults — map from `contentType` allowlist

---

## Files

| File | Role |
|------|------|
| `apps/web/src/pages/docs/ai.astro` | Public AI stack documentation |
| `REBIRTH.md` | Product spec, guardrails |
| `services/api/src/lib/contentGovernance.js` | Pre-publish validation (shipped) |
| `apps/player/src/contentGovernance.ts` | Client-side genre rules |
