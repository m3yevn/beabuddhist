# Be A Buddhist 🙏

**Sacred audio platform** — prayer routines, Spotify-style player, free open-source AI soundscapes.

| | |
|---|---|
| **Web (v2)** | [beabuddhist.vercel.app](https://beabuddhist.vercel.app) |
| **Docs** | [beabuddhist.vercel.app/docs](https://beabuddhist.vercel.app/docs) |
| **Free AI** | [beabuddhist.vercel.app/docs/ai](https://beabuddhist.vercel.app/docs/ai) |
| **Android (v1)** | [Google Play](https://play.google.com/store/apps/details?id=com.beabuddhist.app) |

## v2 rebirth (in progress)

```
beabuddhist/
├── apps/web/       ← Astro landing + docs (Phase 0 ✅)
├── legacy/         ← Ionic 4 app (v1, root of repo)
└── REBIRTH.md      ← full product spec
```

**Vision:** Spotify player UX + Suno-style ambient generation — using **only free OSS AI** (MusicGen, Bark, Piper).

### Roadmap

- [x] Phase 0 — Landing + docs
- [ ] Phase 1 — Web PWA player (auth, routines, playback)
- [ ] Phase 2 — Queue, offline, discover
- [ ] Phase 3 — Free AI soundscapes
- [ ] Phase 4 — Capacitor → Play Store v2

## v1 legacy app

Ionic 4 / Angular 7 / Firebase 5 — still on Play Store.

```bash
npm install
ionic serve
```

## Develop web (v2)

```bash
cd apps/web
npm install
npm run dev    # http://localhost:4321
npm run build
```

## License

MIT © [Kevin Moe Myint Myat](https://kevinmoemyintmyat.vercel.app)
