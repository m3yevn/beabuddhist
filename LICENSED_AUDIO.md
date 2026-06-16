# Licensed Audio Ingestion

> Eternal Flame · replace Pixabay placeholders with monastery-reviewed recordings

---

## Current state (v2)

- Tracks use **Pixabay** ambient URLs (`isPlaceholderAudio: true`)
- Titles and metadata are spiritually accurate; audio is royalty-free placeholder
- `contentGovernance.js` warns on placeholder audio (−10 score)

---

## Ingestion workflow

1. **Source** — Record or license from monastery / teacher (written permission)
2. **Format** — MP3 128–192 kbps or Opus; normalize −16 LUFS
3. **Upload** — Vercel Blob or CDN path `https://cdn.beabuddhist.app/audio/{packageId}/{trackId}.mp3`
4. **Update** — `data/catalog.mjs` track: set `audioUrl`, `isPlaceholderAudio: false`, `license: "..."`, `recordedAt`
5. **Validate** — `npm run validate:catalog` (API governance) must pass
6. **Deploy** — Bump `CATALOG_VERSION` in `contentGovernance.js` → API reseeds MongoDB

---

## Manifest template

```json
{
  "trackId": "metta-paritta",
  "packageId": "pali-morning-paritta",
  "source": "Venerable Ananda / temple recording 2024",
  "license": "CC-BY-NC-4.0",
  "audioUrl": "https://cdn.beabuddhist.app/audio/pali-morning-paritta/metta-paritta.mp3",
  "isPlaceholderAudio": false
}
```

Store manifests in `data/licensed/` as tracks are cleared.

---

## Priority replacements

| Package | Why |
|---------|-----|
| Pali Morning Paritta | Most visible featured content |
| Guided Breath Anchor | Meditation onboarding |
| Heart Sutra Recitation | Mahayana flagship |

---

## Do not use

- SoundHelix or random demo URLs
- EDM / electronic stock mislabeled as chant
- AI output without `validateAiDraft()` + human review
