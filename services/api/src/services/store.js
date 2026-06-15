import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";
import { signToken } from "../middleware/auth.js";
import { categories, packages } from "../data/catalog.js";

export async function seedCatalogIfEmpty() {
  const db = getDb();
  const count = await db.collection("categories").countDocuments();
  if (count > 0) return;
  await db.collection("categories").insertMany(categories);
  await db.collection("packages").insertMany(packages);
}

export async function signUp(email, password, displayName) {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  const existing = await db.collection("users").findOne({ email: normalized });
  if (existing) {
    const err = new Error("Email already registered.");
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const { insertedId } = await db.collection("users").insertOne({
    email: normalized,
    passwordHash,
    displayName: displayName || normalized.split("@")[0],
    createdAt: new Date(),
  });
  const token = signToken(insertedId.toString(), normalized);
  return { token, user: { id: insertedId.toString(), email: normalized, displayName: displayName || normalized.split("@")[0] } };
}

export async function signIn(email, password) {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  const user = await db.collection("users").findOne({ email: normalized });
  if (!user) {
    const err = new Error("Invalid email or password.");
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error("Invalid email or password.");
    err.status = 401;
    throw err;
  }
  const token = signToken(user._id.toString(), user.email);
  return {
    token,
    user: { id: user._id.toString(), email: user.email, displayName: user.displayName },
  };
}

export async function listCategories() {
  return getDb().collection("categories").find().sort({ order: 1 }).toArray();
}

export async function listPackages(categoryId) {
  const query = categoryId ? { categoryId } : {};
  return getDb().collection("packages").find(query).toArray();
}

export async function getPackage(packageId) {
  return getDb().collection("packages").findOne({ id: packageId });
}

export async function listRoutines(userId) {
  return getDb()
    .collection("routines")
    .find({ userId })
    .sort({ title: 1 })
    .toArray();
}

export async function createRoutine(userId, { title }) {
  const doc = {
    userId,
    title: title.trim(),
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const { insertedId } = await getDb().collection("routines").insertOne(doc);
  return { ...doc, _id: insertedId, id: insertedId.toString() };
}

export async function getRoutine(userId, routineId) {
  const routine = await getDb().collection("routines").findOne({
    _id: new ObjectId(routineId),
    userId,
  });
  if (!routine) return null;
  return { ...routine, id: routine._id.toString() };
}

export async function updateRoutine(userId, routineId, updates) {
  const result = await getDb().collection("routines").findOneAndUpdate(
    { _id: new ObjectId(routineId), userId },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) return null;
  return { ...result, id: result._id.toString() };
}

export async function deleteRoutine(userId, routineId) {
  const result = await getDb().collection("routines").deleteOne({
    _id: new ObjectId(routineId),
    userId,
  });
  return result.deletedCount > 0;
}

export async function addTask(userId, routineId, { packageId, trackId }) {
  const pkg = await getPackage(packageId);
  if (!pkg) {
    const err = new Error("Package not found.");
    err.status = 404;
    throw err;
  }
  const track = pkg.tracks.find((t) => t.id === trackId) || pkg.tracks[0];
  const task = {
    id: new ObjectId().toString(),
    packageId: pkg.id,
    categoryId: pkg.categoryId,
    packageTitle: pkg.title,
    trackId: track.id,
    title: track.title,
    audioUrl: track.audioUrl,
    durationSec: track.durationSec,
  };
  const result = await getDb().collection("routines").findOneAndUpdate(
    { _id: new ObjectId(routineId), userId },
    { $push: { tasks: task }, $set: { updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) {
    const err = new Error("Routine not found.");
    err.status = 404;
    throw err;
  }
  return { ...result, id: result._id.toString() };
}

export async function removeTask(userId, routineId, taskId) {
  const result = await getDb().collection("routines").findOneAndUpdate(
    { _id: new ObjectId(routineId), userId },
    { $pull: { tasks: { id: taskId } }, $set: { updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) return null;
  return { ...result, id: result._id.toString() };
}

export async function resolvePlayback(userId, routineId) {
  const routine = await getRoutine(userId, routineId);
  if (!routine) return null;
  return {
    routineId: routine.id,
    title: routine.title,
    tracks: routine.tasks.map((t, i) => ({
      index: i,
      taskId: t.id,
      title: t.title,
      packageTitle: t.packageTitle,
      audioUrl: t.audioUrl,
      durationSec: t.durationSec,
    })),
  };
}
