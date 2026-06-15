# Be A Buddhist — Production setup

Unblocks sign-up, routines, and catalog on [beabuddhist.vercel.app/app](https://beabuddhist.vercel.app/app/).

## 1. MongoDB Atlas (free tier)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Create** cluster (M0 free).
2. **Database Access** → Add user (password auth) — save username + password.
3. **Network Access** → **Allow access from anywhere** (`0.0.0.0/0`) for Vercel serverless.
4. **Database** → Connect → **Drivers** → copy connection string:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 2. Vercel env (`beabuddhist-api` project)

[Vercel dashboard](https://vercel.com) → project **beabuddhist-api** → Settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `MONGODB_STRING` | Atlas connection string (URL-encode password if special chars) | Production, Preview |
| `MONGODB_NAME` | `beabuddhist` | Production, Preview |
| `JWT_SECRET` | Random 32+ char string (`openssl rand -hex 32`) | Production, Preview |

**Redeploy** after saving env vars (Deployments → ⋯ → Redeploy).

## 3. Verify

```bash
curl https://api-brown-iota.vercel.app/health
```

Expected when configured:

```json
{
  "success": true,
  "status": "healthy",
  "service": "beabuddhist-api",
  "database": "connected"
}
```

If `database: "NOT_CONFIGURED"` — env vars missing.  
If `CONNECTION_FAILED` — check Atlas IP allowlist and credentials.

## 4. Test the app

1. Open [beabuddhist.vercel.app/app/login](https://beabuddhist.vercel.app/app/login)
2. Sign up with email + password
3. Create a routine → **Discover** → open a package → **Add to routine**
4. Play routine from Home

## Local dev

```bash
# Terminal 1 — API (needs local Mongo or Atlas string in services/api/.env)
cd services/api
cp .env.example .env   # if exists, or create:
# MONGODB_STRING=mongodb://127.0.0.1:27017
# MONGODB_NAME=beabuddhist
# JWT_SECRET=dev-secret-change-me
npm run dev

# Terminal 2 — player
cd apps/player && npm run dev
```

## v1 Firebase migration (Phase 2+)

Export Firestore from the legacy Ionic app project, then run:

```bash
node scripts/migrate-v1-catalog.js --input ./export/catalog.json
```

See `scripts/migrate-v1-catalog.js` for field mapping from v1 hardcoded doc IDs to the v2 catalog schema.
