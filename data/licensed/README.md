# Licensed audio manifests

One JSON file per cleared track. When ready to ship:

1. Add manifest here (drop `.example` suffix)
2. Update `data/catalog.mjs` with `audioUrl`, `isPlaceholderAudio: false`, `license`
3. Run `npm run validate:catalog --prefix services/api`
4. Bump `CATALOG_VERSION` in `services/api/src/lib/contentGovernance.js`
5. Sync: `node services/api/scripts/sync-catalog.mjs` and redeploy API

See [`LICENSED_AUDIO.md`](../LICENSED_AUDIO.md).
