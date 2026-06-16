# Be A Buddhist Content Governance

> Content Integrity Layer — prevents spiritually inappropriate metadata and audio pairing.

---

## Principles

1. **Context over popularity** — genres must match content purpose, not algorithmic defaults.
2. **Label honestly** — placeholder and AI audio are always disclosed.
3. **Validate before publish** — no catalog entry ships without governance pass.
4. **Separate lanes** — licensed dharma, demo placeholders, and future AI content are distinct.

---

## Forbidden genres

These must **never** appear on chant, meditation, dharma, or learning content:

- Electronic dance music, EDM, electro house, house, club
- Dubstep, techno, trance, drum and bass
- Hip hop, trap, metal, punk, disco, funk

Implementation: `FORBIDDEN_GENRES` in `services/api/src/lib/contentGovernance.js`

---

## Allowed genres by content type

| contentType | Allowed genres (examples) |
|-------------|---------------------------|
| `chant` | pali, sanskrit, theravada, mahayana, devotional, temple chant |
| `meditation` | guided, mindfulness, ambient, breathing, loving-kindness |
| `dharma` | teaching, lecture, discussion, study, dharma talk |
| `instrumental` | temple ambience, nature sounds, singing bowls, soft instrumental |
| `learning` | beginner, history, philosophy, study material |

---

## Validation API

```js
validateTrackMetadata(track, { contentType, genre })
validatePackageMetadata(pkg)
validateCatalog(packages)  // called at API seed
recommendationScore(pkg)   // surfacing priority
```

### Scoring

| Condition | Score impact |
|-----------|--------------|
| Forbidden genre | Fail (block) |
| Genre mismatch for contentType | Warning, −15 |
| Missing title / audioUrl | Fail |
| `isPlaceholderAudio` | Warning, −10 |
| Has `creatorId` | +3 |
| `isFeatured` | +5 |
| Licensed (non-placeholder) | +10 |

---

## UI disclosure

- Package pages show integrity notice when any track has `isPlaceholderAudio`
- Footer: “Demo catalog · calm placeholder audio”
- Future: `aiGenerated` badge on AI soundscapes

---

## AI pipeline hooks (Phase 3)

Before any AI output is stored:

1. Run `validatePackageMetadata()` on proposed package
2. Reject if `score < 70` or any hard errors
3. Store validation result on `generations` document
4. Require human opt-in to publish to public catalog

### Prompt rules

- Include tradition and mood in prompt
- Explicitly exclude: drums, beats, EDM, vocals unless chant-appropriate
- Example: `"soft temple bells, 20 min meditation ambient, no drums, no electronic beat"`

---

## Review queue (future)

| Tier | Review |
|------|--------|
| Licensed monastery recordings | Manual approval |
| Community uploads | Moderation queue |
| AI soundscapes | Automated + spot check |
| Demo placeholders | Dev/staging only (current prod should migrate to licensed) |

---

## File map

| Path | Role |
|------|------|
| `services/api/src/lib/contentGovernance.js` | Server validation |
| `apps/player/src/contentGovernance.ts` | Client helpers |
| `data/catalog.mjs` | Canonical catalog with metadata |
| `services/api/src/services/store.js` | Validates on seed |
