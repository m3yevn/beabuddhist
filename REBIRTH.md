# Be A Buddhist — Rebirth Spec

**From:** Ionic 4 / Angular 7 Android app (2020)  
**To:** Sacred audio platform — **Spotify player UX** + **Suno-style generative audio** for Buddhist practice  
**Live today:** [Google Play](https://play.google.com/store/apps/details?id=com.beabuddhist.app) · [GitHub](https://github.com/m3yevn/beabuddhist)

---

## What worked in v1 (keep)

- **Routines** — named prayer sequences (unique vs generic music apps)
- **Task playlists** — ordered chants/mantras per routine
- **Browse by tradition** — Firestore categories → audio packages
- **Sequential playback** — play full routine hands-free
- **Profiles & social** — follow practitioners (lightweight community)
- **Play Store presence** — real users, real reviews

## What's broken in v1 (replace)

| Issue | v2 fix |
|-------|--------|
| Angular 7 / Ionic 4 EOL | Web-first PWA → Capacitor 6 |
| `ion-slides` removed in modern Ionic | Swiper / native scroll |
| Hardcoded Firestore doc IDs | Config-driven catalog + admin |
| Broken `/explore-courses` route | Proper discover hub |
| `restcountries.eu` dead | Static country list or modern API |
| Orange 2019 UI | Dark immersive player (Spotify-like) |
| No web presence | Landing + docs on Vercel |
| No AI | Suno-style ambient + guided generation |

---

## Product vision

### Spotify layer (familiar UX)

```
┌─────────────────────────────────────────────────────────┐
│  ♪  Now Playing: Morning Metta Routine          ▶ ━━━ │
├─────────────────────────────────────────────────────────┤
│  Home          Discover        Library        Profile   │
│  ────                                                   │
│  [ Hero: Continue routine ]                             │
│  [ Made for you — 3 routines ]                        │
│  [ Recently played chants ]                             │
└─────────────────────────────────────────────────────────┘
```

- Persistent mini-player + full-screen now playing
- Queue, skip, seek, repeat routine / repeat track
- **Library:** saved routines, downloaded chants (offline PWA)
- **Discover:** categories (Theravada, Mahayana, mindfulness, Pali chanting…)
- Search: chants, routines, teachers, users

### Suno layer (generative sacred audio)

Not generic music generation — **practice-aligned**:

| Feature | Description |
|---------|-------------|
| **Ambient session** | Prompt: "20 min metta, soft temple bells, Myanmar style" → generated backing track |
| **Mantra loop** | Extend a chant seamlessly for japa repetition |
| **Guided intro** | TTS or licensed teacher clip + AI bed |
| **Mood match** | "Calm / focus / devotion" sliders adjust soundscape |
| **Routine fill** | AI suggests tasks to complete a 30-min morning routine |

**Guardrails:** no lyrics that violate precepts; optional monastery review queue for AI outputs; clear labeling of AI vs recorded dharma.

---

## Technical architecture (v2)

```
beabuddhist/
├── apps/
│   ├── web/              # Astro + React islands — landing, docs, PWA player
│   └── mobile/           # Capacitor shell (wraps web player)
├── packages/
│   ├── player/           # Shared audio engine (Howler or Web Audio API)
│   ├── ui/               # Player components (now-playing, queue, browse)
│   └── api-client/       # Typed API SDK
├── services/
│   └── api/              # Hono or express-instant — auth, routines, catalog
└── legacy/               # This repo (archived, reference only)
```

### Stack choices

| Layer | Choice | Why |
|-------|--------|-----|
| Web app | **Astro 5** + React | Fast landing/docs; React for player |
| Mobile | **Capacitor 6** | Reuse web player; Play Store update path |
| API | **express-instant** or **Hono** | Kevin's stack; JSON config for routes |
| DB | **Supabase** or **Firebase v10 modular** | Auth + realtime + storage for audio |
| Audio CDN | **Cloudflare R2** + signed URLs | Cheap chant file hosting |
| AI audio | **Suno API** / **ElevenLabs** / self-hosted MusicGen | Phase 3; abstract behind `AudioGenProvider` |
| Deploy | **Vercel** (web) + **Render/Fly** (API) | Same as other portfolio projects |

---

## Data model (migrate from Firestore)

```
users
  id, displayName, avatar, country, bio, followers[], following[]

categories          # was hardcoded browse roots
  id, name, coverImage, order

packages            # audio albums
  id, categoryId, title, coverImage, tasks[]

tasks               # individual tracks
  id, packageId, title, audioUrl, durationSec, order

routines
  id, userId, title, avatar, taskIds[], isPublic

generations (new)   # AI sessions
  id, userId, prompt, audioUrl, mood, createdAt
```

---

## Phased delivery

### Phase 0 — Presence (1 week)
- [x] Landing page at `beabuddhist.vercel.app` (reuse express-instant public/ pattern)
- [x] `/docs` — v1 features, v2 roadmap, link to Play Store
- [x] `/docs/ai` — free OSS AI stack (MusicGen, Bark, Piper, HF)
- [ ] GitHub README overhaul

### Phase 1 — Web player MVP (3–4 weeks)
- [ ] Auth (email + Google)
- [ ] Browse categories + play single package
- [ ] Create/edit/delete routines
- [ ] Sequential routine playback
- [ ] Migrate or re-seed catalog from v1 Firestore

### Phase 2 — Spotify polish (2–3 weeks)
- [ ] Now-playing UI, queue, mini-player
- [ ] Library + offline (service worker)
- [ ] Discover feed + search
- [ ] Profile + follow

### Phase 3 — Suno integration (4+ weeks)
- [ ] Ambient generation flow
- [ ] "Extend chant" loop
- [ ] Routine AI suggest
- [ ] Moderation / labeling

### Phase 4 — Mobile (2 weeks)
- [ ] Capacitor build
- [ ] Play Store listing update (`com.beabuddhist.app` v2)
- [ ] Background audio + lock screen controls

---

## Landing page copy (draft)

**Headline:** Your practice. One routine. Infinite peace.

**Sub:** Build prayer routines, discover sacred audio, and let AI soundscapes deepen your meditation — the mindful alternative to endless scrolling.

**CTA:** Open Web App · Download on Play Store

---

## Open questions

1. **Brand name** — keep "Be A Buddhist" or evolve (e.g. **Sādhu**, **DharmaFlow**, **Chant**)?
2. **Firebase** — migrate in place or fresh Supabase project?
3. **AI provider** — free OSS only: MusicGen, Bark, Piper, Hugging Face free tier (see `/docs/ai`)
4. **Content** — who owns chant recordings? Licensing for v2 catalog?
5. **Monetization** — free + donations, premium offline, or monastery partnerships?

---

## Next step

Scaffold `beabuddhist/apps/web` with Astro landing (dark Spotify aesthetic) and link from this repo's README. Say the word to start Phase 0.
