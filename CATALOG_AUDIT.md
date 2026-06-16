# Be A Buddhist Catalog Audit

> Snapshot: catalog v2 · `beabuddhist/data/catalog.mjs` · 2026-06-17

---

## Inventory (v2 seed)

| Entity | Count | Source |
|--------|-------|--------|
| **Categories** | 8 | `export const categories` |
| **Packages** | 15 | `export const packages` |
| **Tracks** | 30 | All tracks have `isPlaceholderAudio: true` |
| **Creators** | 5 | `export const creators` |
| **Collections** | 6 | `export const collections` |
| **Curated playlists** | 8 | `export const curatedPlaylists` |
| **User playlists (routines)** | Dynamic | MongoDB `routines` collection |

### v1 (before rebirth)

| Entity | Count |
|--------|-------|
| Categories | 3 (`metta`, `mindfulness`, `chants`) |
| Packages | 3 |
| Tracks | 5 |
| Creators | 0 |
| Collections | 0 |
| Curated playlists | 0 |

---

## Categories

| ID | Title | Topic |
|----|-------|-------|
| `chanting-pali` | Pali Chanting | chanting |
| `chanting-sanskrit` | Sanskrit Chanting | chanting |
| `chanting-mahayana` | Mahayana Chanting | chanting |
| `meditation-guided` | Guided Meditation | meditation |
| `meditation-mindfulness` | Mindfulness Practice | meditation |
| `dharma` | Dharma Talks | dharma |
| `instrumental` | Instrumental Ambient | instrumental |
| `learning` | Buddhist Learning | learning |

---

## Content types & genres

Every package includes:

- `contentType` — `chant` | `meditation` | `dharma` | `instrumental` | `learning`
- `genre` — contextually appropriate (e.g. `pali`, `guided`, `temple ambience`)
- `tradition` — Theravada, Mahayana, Vajrayana, etc.
- `topics[]` — searchable tags

Tracks include `genre`, `mood`, `isPlaceholderAudio`.

---

## Audio authenticity issue (resolved in v2)

### Root cause (v1)

Tracks titled “Three Refuges” and “Metta Sutta” pointed to **SoundHelix** demo MP3s — algorithmic electronic/pop instrumentals. There was **no genre field** and **no AI pipeline**; the mismatch was **placeholder URL choice**, not LLM hallucination.

### v2 fix

- Replaced SoundHelix with **calm Pixabay meditation ambience** placeholders
- Added `isPlaceholderAudio: true` on every track
- UI shows integrity notice on package pages
- `contentGovernance.js` blocks forbidden genres (EDM, club, etc.) at seed time

---

## Collections

| ID | Title | Packages |
|----|-------|----------|
| `starter-path` | Starter Path | 3 |
| `morning-devotion` | Morning Devotion | 3 |
| `deep-practice-retreat` | Deep Practice Retreat | 3 |
| `wisdom-study-circle` | Wisdom Study Circle | 3 |
| `mahayana-evening-liturgies` | Mahayana Evening Liturgies | 3 |
| `healing-and-compassion` | Healing and Compassion | 3 |

---

## Curated playlists

| ID | Title | Tracks |
|----|-------|--------|
| `daily-dawn-ritual` | Daily Dawn Ritual | 3 |
| `evening-quiet-mind` | Evening Quiet Mind | 3 |
| `compassion-cultivation` | Compassion Cultivation | 3 |
| `focus-and-clarity` | Focus and Clarity | 3 |
| `sutra-service-flow` | Sutra Service Flow | 3 |
| `dharma-study-hour` | Dharma Study Hour | 3 |
| `retreat-silence-bed` | Retreat Silence Bed | 3 |
| `weekly-balanced-path` | Weekly Balanced Path | 4 |

---

## API / deployment note

MongoDB seeds on `CATALOG_VERSION` change (`services/api/src/services/store.js`). Production API must redeploy to replace v1 catalog (3 categories) with v2 (8 categories).

---

## Gaps (honest)

- All audio is **placeholder** — not licensed chant recordings
- No real creator pages or upload workflow
- v1 Firestore catalog not migrated (script exists, no export in repo)
- No `genre` field in API TypeScript types on server responses (embedded in package docs)
