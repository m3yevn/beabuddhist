# Play Store Publishing — Be A Buddhist

You already have a **Google Play Developer account** and a live app:

- **Package:** `com.beabuddhist.app`
- **Listing:** [Play Store](https://play.google.com/store/apps/details?id=com.beabuddhist.app)

v2 strategy: **Web-first PWA** at [beabuddhist.vercel.app/app](https://beabuddhist.vercel.app/app/) — install via Add to Home Screen. Play Store update is **optional** (Phase 4), not required for v2 launch.

---

## Why keep `com.beabuddhist.app`

| Approach | Pros | Cons |
|----------|------|------|
| **Update existing app** | Keeps reviews, installs, ASO history | Must support migration from v1 Firebase data |
| New package ID | Clean slate | Lose reviews & users must reinstall |

**Recommendation:** Same package ID, major version bump (e.g. `2.0.0`), "What's new" explains web-powered rebuild.

---

## Prerequisites checklist

- [x] Play Console developer account (you have this)
- [x] Privacy policy URL → [beabuddhist.vercel.app/privacy](https://beabuddhist.vercel.app/privacy)
- [ ] MongoDB Atlas production cluster + `MONGODB_STRING` on Vercel
- [ ] App content rating questionnaire (likely **Everyone** / religious content)
- [ ] Data safety form (email, user-generated routines — declare collection & encryption)
- [ ] Screenshots from v2 web app (phone + 7" tablet)
- [ ] Feature graphic + icon refresh (optional but recommended)

---

## Phase 4 — Capacitor wrap (when web PWA is stable)

```bash
cd beabuddhist/apps/mobile   # to be created
npm init @capacitor/app
# point webDir to ../web/public/app or built dist
npx cap add android
npx cap sync
npx cap open android
```

### Android requirements (2026)

- **targetSdkVersion** 34+ (Google Play mandate)
- **64-bit** ABI
- **Background audio** permission + foreground service for chant playback
- **Signing:** use Play App Signing (upload key in Play Console)

### Store listing copy (draft)

**Title:** Be A Buddhist — Prayer Routines

**Short:** Build prayer routines. Play chants & mantras. Practice with clarity.

**Full:** Spotify-style player for sacred audio. Create ordered prayer routines, discover Theravada chants and mindfulness packages, and practice hands-free. v2 adds web + optional free AI ambient soundscapes.

---

## Release train

| Step | Action |
|------|--------|
| 1 | Ship web PWA at `/app` (Phase 1 ✅) |
| 2 | Beta test via Play **Internal testing** track |
| 3 | Capacitor build → AAB upload |
| 4 | Staged rollout 10% → 50% → 100% |
| 5 | Deprecate Ionic v1 codebase after 30 days |

---

## Migration from v1 Firebase

v1 data lives in Firestore (`people/{uid}/routines`, `buddhism/global/...`). Phase 1 uses a **new MongoDB catalog** with demo audio.

**Migration options:**

1. **One-time export script** — Firebase Admin SDK → import to MongoDB
2. **Dual-read period** — v2 app reads Firebase if Mongo empty (complex)
3. **Fresh start** — new users only; v1 users re-create routines (simplest for beta)

For Play Store update, option 1 or 3 before public launch.

---

## Costs (free tier friendly)

| Service | Cost |
|---------|------|
| Play Console | $25 one-time (already paid) |
| Vercel | Hobby free |
| MongoDB Atlas | M0 free cluster |
| AI (MusicGen etc.) | $0 self-hosted / HF free tier |

---

## Next actions for you

1. Create **MongoDB Atlas** M0 cluster → add `MONGODB_STRING` to Vercel project `beabuddhist`
2. Test `/app` on phone browser → Add to Home Screen (PWA)
3. When ready for Play: run Capacitor scaffold (Phase 4 — we can automate)
4. Update Play Console **Data safety** + link privacy URL
