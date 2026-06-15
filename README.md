# Be A Buddhist 🙏

**Sacred audio platform** — prayer routines, Spotify-style player, free open-source AI soundscapes.

| | |
|---|---|
| **Web app (v2)** | [beabuddhist.vercel.app/app](https://beabuddhist.vercel.app/app/) |
| **Landing** | [beabuddhist.vercel.app](https://beabuddhist.vercel.app) |
| **Docs** | [/docs](https://beabuddhist.vercel.app/docs) · [/docs/ai](https://beabuddhist.vercel.app/docs/ai) |
| **Privacy** | [/privacy](https://beabuddhist.vercel.app/privacy) (Play Store) |
| **Android (v1)** | [Google Play](https://play.google.com/store/apps/details?id=com.beabuddhist.app) |

## v2 monorepo

```
beabuddhist/
├── apps/web/           Astro — landing, docs, privacy
├── apps/player/        React PWA — routines, browse, player
├── services/api/       Express + MongoDB API
├── PUBLISHING.md       Play Store guide (existing dev account)
└── REBIRTH.md          Product spec
```

## Roadmap

- [x] Phase 0 — Landing + docs + free AI stack page
- [x] Phase 1 — Web PWA: auth, browse, routines, playback
- [ ] Phase 2 — Queue polish, offline, search
- [ ] Phase 3 — Free AI soundscapes (MusicGen, Piper)
- [ ] Phase 4 — Capacitor → **update** `com.beabuddhist.app` on Play Store

See [PUBLISHING.md](./PUBLISHING.md) for Play Store strategy with your existing developer account.

## Local development

**API** (needs MongoDB — `cp .env.example .env`):

```bash
cd services/api && npm install && npm run dev   # :4000
```

**Player** (proxies `/api` → localhost:4000):

```bash
cd apps/player && npm install && npm run dev    # :5173/app/
```

**Landing**:

```bash
cd apps/web && npm install && npm run dev       # :4321
```

**Production build** (from repo root):

```bash
npm install --prefix services/api
npm install --prefix apps/player && npm run build --prefix apps/player
npm install --prefix apps/web && npm run build --prefix apps/web
```

## Vercel env vars

Set on project `beabuddhist`:

| Variable | Description |
|----------|-------------|
| `MONGODB_STRING` | MongoDB Atlas connection string |
| `MONGODB_NAME` | `beabuddhist` |
| `JWT_SECRET` | Random secret for auth tokens |

## v1 legacy (Ionic 4)

```bash
npm install && ionic serve
```

## License

MIT © [Kevin Moe Myint Myat](https://kevinmoemyintmyat.vercel.app)
