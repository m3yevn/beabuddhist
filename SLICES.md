# Be A Buddhist — Vertical Slices

Sacred audio PWA — chanting, meditation, dharma, ambient.

## Done

| Slice | Notes |
|-------|-------|
| **Monorepo v2** | Astro landing + React player + Express/Mongo API |
| **Player PWA** | Browse, search, library, routines, mini-player, queue |
| **Auth & social** | Sign up, profile, follow |
| **Experience rebirth (2)** | Catalog v2 deploy · landing alignment · AI governance hooks |
| **Legal** | `/privacy`, `/terms`, footer contact links |
| **Audits** | `BEABUDDHIST_UX_AUDIT.md`, `CATALOG_AUDIT.md`, `AI_PIPELINE_AUDIT.md` |
| **Licensed audio plan** | `LICENSED_AUDIO.md` · `data/licensed/` manifests · `validate:catalog` |
| **Account deletion** | `DELETE /users/me` + profile UI |
| **Phase 3 procedural** | `POST /ai/generate-ambient` governance draft |
| **API Vercel bundle** | `catalog.seed.mjs` in `services/api` — reseed confirmed v2/8 categories |

## Next

| # | Slice | Scope |
|---|-------|-------|
| 1 | **Licensed audio** | Upload recordings per `data/licensed/` — replace Pixabay |
| 2 | **Phase 3 AI generate** | Procedural ambient spec live · MusicGen/Bark next |
| 3 | **Capacitor** | Play Store wrapper (see `PUBLISHING.md`) |

## Live

- [beabuddhist.vercel.app](https://beabuddhist.vercel.app)
- Player: [/app](https://beabuddhist.vercel.app/app)
- API: `beabuddhist-api.vercel.app`
