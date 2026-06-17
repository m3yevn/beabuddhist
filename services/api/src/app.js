import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { connectDb, pingDb } from "./db.js";
import { requireAuth } from "./middleware/auth.js";
import * as store from "./services/store.js";
import { categories as seedCategories, packages as seedPackages } from "./data/catalog.js";
import { CATALOG_VERSION } from "./lib/contentGovernance.js";
import { getAiPipelineStatus, validateAiDraft, generateProceduralAmbient } from "./lib/audioGenProvider.js";

configDotenv();

let catalogSeeded = false;

async function ensureDb(_req, res, next) {
  try {
    await connectDb();
    if (!catalogSeeded) {
      await store.seedCatalogIfEmpty();
      catalogSeeded = true;
    }
    next();
  } catch (e) {
    res.status(503).json({
      error: "DATABASE_UNAVAILABLE",
      message:
        e.code === "NOT_CONFIGURED"
          ? "Set MONGODB_STRING, MONGODB_NAME, and JWT_SECRET on the beabuddhist-api Vercel project."
          : e.message,
    });
  }
}

async function listCategories() {
  try {
    if (process.env.MONGODB_STRING) {
      await connectDb();
      if (!catalogSeeded) {
        await store.seedCatalogIfEmpty();
        catalogSeeded = true;
      }
      const rows = await store.listCategories();
      if (rows.length) return rows;
    }
  } catch {
    /* fall through to static seed */
  }
  return seedCategories;
}

async function listPackages(categoryId) {
  try {
    if (process.env.MONGODB_STRING) {
      await connectDb();
      if (!catalogSeeded) {
        await store.seedCatalogIfEmpty();
        catalogSeeded = true;
      }
      const rows = await store.listPackages(categoryId);
      if (rows.length) return rows;
    }
  } catch {
    /* fall through */
  }
  return seedPackages.filter((p) => p.categoryId === categoryId);
}

async function getPackage(packageId) {
  try {
    if (process.env.MONGODB_STRING) {
      await connectDb();
      if (!catalogSeeded) {
        await store.seedCatalogIfEmpty();
        catalogSeeded = true;
      }
      const pkg = await store.getPackage(packageId);
      if (pkg) return pkg;
    }
  } catch {
    /* fall through */
  }
  return seedPackages.find((p) => p.id === packageId) ?? null;
}

export async function createApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use((req, _res, next) => {
    if (req.url.startsWith("/api/")) req.url = req.url.slice(4);
    else if (req.url === "/api") req.url = "/";
    next();
  });

  app.get("/health", async (_req, res) => {
    const db = await pingDb();
    res.status(db.ok ? 200 : 503).json({
      success: db.ok,
      status: db.ok ? "healthy" : "degraded",
      service: "beabuddhist-api",
      database: db.ok ? "connected" : db.code,
      ...(db.error && !db.ok ? { message: db.error } : {}),
    });
  });

  // Public catalog — works without MongoDB
  app.get("/catalog/categories", async (_req, res) => {
    const categories = await listCategories();
    res.json({ success: true, categories });
  });

  app.get("/catalog/categories/:categoryId/packages", async (req, res) => {
    const packages = await listPackages(req.params.categoryId);
    res.json({ success: true, packages });
  });

  app.get("/catalog/packages/:packageId", async (req, res) => {
    const pkg = await getPackage(req.params.packageId);
    if (!pkg) return res.status(404).json({ error: "NOT_FOUND", message: "Package not found." });
    res.json({ success: true, package: pkg });
  });

  app.get("/catalog/meta", async (_req, res) => {
    const meta = {
      expectedVersion: CATALOG_VERSION,
      categoriesInCode: seedCategories.length,
      packagesInCode: seedPackages.length,
      tracksInCode: seedPackages.reduce((n, p) => n + (p.tracks?.length || 0), 0),
    };
    try {
      if (process.env.MONGODB_STRING) {
        await connectDb();
        if (!catalogSeeded) {
          await store.seedCatalogIfEmpty();
          catalogSeeded = true;
        }
        const { getDb } = await import("./db.js");
        const row = await getDb().collection("meta").findOne({ _id: "catalog" });
        const categoryCount = await getDb().collection("categories").countDocuments();
        meta.version = row?.version ?? null;
        meta.seededAt = row?.seededAt ?? null;
        meta.categoryCount = categoryCount;
        meta.trackCount = row?.trackCount ?? null;
        meta.reseeded = row?.version === CATALOG_VERSION;
      }
    } catch (e) {
      meta.databaseError = e.message;
    }
    res.json({ success: true, meta });
  });

  app.get("/ai/status", (_req, res) => {
    res.json({ success: true, ...getAiPipelineStatus() });
  });

  app.post("/ai/validate-draft", (req, res) => {
    const draft = req.body?.package || req.body;
    if (!draft?.title) {
      return res.status(400).json({ error: "VALIDATION", message: "package draft required." });
    }
    const result = validateAiDraft(draft);
    res.json({ success: true, ...result });
  });

  app.post("/ai/generate-ambient", (req, res) => {
    const { title, contentType, mood, durationSec } = req.body || {};
    const result = generateProceduralAmbient({ title, contentType, mood, durationSec });
    if (!result.ok) {
      return res.status(422).json({ success: false, error: "GOVERNANCE", ...result });
    }
    res.json({ success: true, ...result, note: "Draft only — not stored. Client renders via Web Audio." });
  });

  // Auth + routines require MongoDB
  const dbRoutes = express.Router();
  dbRoutes.use(ensureDb);

  dbRoutes.post("/auth/sign-up", async (req, res) => {
    try {
      const { email, password, displayName } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "VALIDATION", message: "email and password required." });
      }
      const result = await store.signUp(email, password, displayName);
      res.status(201).json({ success: true, ...result });
    } catch (e) {
      res.status(e.status || 500).json({ error: e.title || "ERROR", message: e.message });
    }
  });

  dbRoutes.post("/auth/sign-in", async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "VALIDATION", message: "email and password required." });
      }
      const result = await store.signIn(email, password);
      res.json({ success: true, ...result });
    } catch (e) {
      res.status(e.status || 500).json({ error: e.title || "ERROR", message: e.message });
    }
  });

  dbRoutes.get("/routines", requireAuth, async (req, res) => {
    const routines = await store.listRoutines(req.user.sub);
    res.json({
      success: true,
      routines: routines.map((r) => ({ ...r, id: r._id.toString() })),
    });
  });

  dbRoutes.post("/routines", requireAuth, async (req, res) => {
    const { title } = req.body || {};
    if (!title?.trim()) {
      return res.status(400).json({ error: "VALIDATION", message: "title required." });
    }
    const routine = await store.createRoutine(req.user.sub, { title });
    res.status(201).json({ success: true, routine });
  });

  dbRoutes.get("/routines/:id", requireAuth, async (req, res) => {
    const routine = await store.getRoutine(req.user.sub, req.params.id);
    if (!routine) return res.status(404).json({ error: "NOT_FOUND", message: "Routine not found." });
    res.json({ success: true, routine });
  });

  dbRoutes.put("/routines/:id", requireAuth, async (req, res) => {
    const { title } = req.body || {};
    const routine = await store.updateRoutine(req.user.sub, req.params.id, { title });
    if (!routine) return res.status(404).json({ error: "NOT_FOUND", message: "Routine not found." });
    res.json({ success: true, routine: { ...routine, id: routine._id.toString() } });
  });

  dbRoutes.delete("/routines/:id", requireAuth, async (req, res) => {
    const ok = await store.deleteRoutine(req.user.sub, req.params.id);
    if (!ok) return res.status(404).json({ error: "NOT_FOUND", message: "Routine not found." });
    res.json({ success: true });
  });

  dbRoutes.post("/routines/:id/tasks", requireAuth, async (req, res) => {
    try {
      const { packageId, trackId } = req.body || {};
      if (!packageId) {
        return res.status(400).json({ error: "VALIDATION", message: "packageId required." });
      }
      const routine = await store.addTask(req.user.sub, req.params.id, { packageId, trackId });
      res.json({ success: true, routine });
    } catch (e) {
      res.status(e.status || 500).json({ error: "ERROR", message: e.message });
    }
  });

  dbRoutes.delete("/routines/:id/tasks/:taskId", requireAuth, async (req, res) => {
    const routine = await store.removeTask(req.user.sub, req.params.id, req.params.taskId);
    if (!routine) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ success: true, routine });
  });

  dbRoutes.get("/routines/:id/playback", requireAuth, async (req, res) => {
    const playback = await store.resolvePlayback(req.user.sub, req.params.id);
    if (!playback) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ success: true, playback });
  });

  dbRoutes.get("/users/me", requireAuth, async (req, res) => {
    const profile = await store.getMyProfile(req.user.sub);
    if (!profile) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ success: true, profile });
  });

  dbRoutes.patch("/users/me", requireAuth, async (req, res) => {
    const profile = await store.updateProfile(req.user.sub, req.body || {});
    if (!profile) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ success: true, profile });
  });

  dbRoutes.delete("/users/me", requireAuth, async (req, res) => {
    const ok = await store.deleteAccount(req.user.sub);
    if (!ok) return res.status(404).json({ error: "NOT_FOUND", message: "Account not found." });
    res.json({ success: true, deleted: true });
  });

  dbRoutes.get("/users/search", requireAuth, async (req, res) => {
    const q = String(req.query.q || "");
    const users = await store.searchUsers(q, req.user.sub);
    res.json({ success: true, users });
  });

  dbRoutes.get("/users/:id", requireAuth, async (req, res) => {
    const profile = await store.getUserProfile(req.user.sub, req.params.id);
    if (!profile) return res.status(404).json({ error: "NOT_FOUND", message: "User not found." });
    res.json({ success: true, profile });
  });

  dbRoutes.post("/users/:id/follow", requireAuth, async (req, res) => {
    try {
      const profile = await store.followUser(req.user.sub, req.params.id);
      res.json({ success: true, profile });
    } catch (e) {
      res.status(e.status || 500).json({ error: "ERROR", message: e.message });
    }
  });

  dbRoutes.delete("/users/:id/follow", requireAuth, async (req, res) => {
    const profile = await store.unfollowUser(req.user.sub, req.params.id);
    if (!profile) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ success: true, profile });
  });

  dbRoutes.get("/users/:id/followers", requireAuth, async (req, res) => {
    const users = await store.listFollowers(req.params.id);
    res.json({ success: true, users });
  });

  dbRoutes.get("/users/:id/following", requireAuth, async (req, res) => {
    const users = await store.listFollowing(req.params.id);
    res.json({ success: true, users });
  });

  app.use(dbRoutes);

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "SERVER_ERROR", message: err.message });
  });

  return app;
}
