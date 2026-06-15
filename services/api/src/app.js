import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { connectDb } from "./db.js";
import { requireAuth } from "./middleware/auth.js";
import * as store from "./services/store.js";

configDotenv();

export async function createApp() {
  await connectDb();
  await store.seedCatalogIfEmpty();

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use((req, _res, next) => {
    if (req.url.startsWith("/api/")) req.url = req.url.slice(4);
    else if (req.url === "/api") req.url = "/";
    next();
  });

  app.get("/health", (_req, res) => {
    res.json({ success: true, status: "healthy", service: "beabuddhist-api" });
  });

  app.post("/auth/sign-up", async (req, res) => {
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

  app.post("/auth/sign-in", async (req, res) => {
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

  app.get("/catalog/categories", async (_req, res) => {
    const categories = await store.listCategories();
    res.json({ success: true, categories });
  });

  app.get("/catalog/categories/:categoryId/packages", async (req, res) => {
    const packages = await store.listPackages(req.params.categoryId);
    res.json({ success: true, packages });
  });

  app.get("/catalog/packages/:packageId", async (req, res) => {
    const pkg = await store.getPackage(req.params.packageId);
    if (!pkg) return res.status(404).json({ error: "NOT_FOUND", message: "Package not found." });
    res.json({ success: true, package: pkg });
  });

  app.get("/routines", requireAuth, async (req, res) => {
    const routines = await store.listRoutines(req.user.sub);
    res.json({
      success: true,
      routines: routines.map((r) => ({ ...r, id: r._id.toString() })),
    });
  });

  app.post("/routines", requireAuth, async (req, res) => {
    const { title } = req.body || {};
    if (!title?.trim()) {
      return res.status(400).json({ error: "VALIDATION", message: "title required." });
    }
    const routine = await store.createRoutine(req.user.sub, { title });
    res.status(201).json({ success: true, routine });
  });

  app.get("/routines/:id", requireAuth, async (req, res) => {
    const routine = await store.getRoutine(req.user.sub, req.params.id);
    if (!routine) return res.status(404).json({ error: "NOT_FOUND", message: "Routine not found." });
    res.json({ success: true, routine });
  });

  app.put("/routines/:id", requireAuth, async (req, res) => {
    const { title } = req.body || {};
    const routine = await store.updateRoutine(req.user.sub, req.params.id, { title });
    if (!routine) return res.status(404).json({ error: "NOT_FOUND", message: "Routine not found." });
    res.json({ success: true, routine: { ...routine, id: routine._id.toString() } });
  });

  app.delete("/routines/:id", requireAuth, async (req, res) => {
    const ok = await store.deleteRoutine(req.user.sub, req.params.id);
    if (!ok) return res.status(404).json({ error: "NOT_FOUND", message: "Routine not found." });
    res.json({ success: true });
  });

  app.post("/routines/:id/tasks", requireAuth, async (req, res) => {
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

  app.delete("/routines/:id/tasks/:taskId", requireAuth, async (req, res) => {
    const routine = await store.removeTask(req.user.sub, req.params.id, req.params.taskId);
    if (!routine) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ success: true, routine });
  });

  app.get("/routines/:id/playback", requireAuth, async (req, res) => {
    const playback = await store.resolvePlayback(req.user.sub, req.params.id);
    if (!playback) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ success: true, playback });
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "SERVER_ERROR", message: err.message });
  });

  return app;
}
