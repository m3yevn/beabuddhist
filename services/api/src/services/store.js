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
  const name = displayName || normalized.split("@")[0];
  const { insertedId } = await db.collection("users").insertOne({
    email: normalized,
    passwordHash,
    displayName: name,
    bio: "",
    avatar: "",
    country: "",
    createdAt: new Date(),
  });
  const token = signToken(insertedId.toString(), normalized);
  return { token, user: toPublicUser({ _id: insertedId, email: normalized, displayName: name, bio: "", avatar: "", country: "" }) };
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
    user: toPublicUser(user),
  };
}

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName || user.email.split("@")[0],
    bio: user.bio || "",
    avatar: user.avatar || "",
    country: user.country || "",
  };
}

async function followCounts(userId) {
  const db = getDb();
  const [followers, following] = await Promise.all([
    db.collection("follows").countDocuments({ followingId: userId }),
    db.collection("follows").countDocuments({ followerId: userId }),
  ]);
  return { followers, following };
}

export async function getMyProfile(userId) {
  const user = await getDb().collection("users").findOne({ _id: new ObjectId(userId) });
  if (!user) return null;
  const counts = await followCounts(userId);
  return { ...toPublicUser(user), ...counts };
}

export async function getUserProfile(viewerId, targetId) {
  const user = await getDb().collection("users").findOne({ _id: new ObjectId(targetId) });
  if (!user) return null;
  const counts = await followCounts(targetId);
  let isFollowing = false;
  if (viewerId && viewerId !== targetId) {
    const edge = await getDb().collection("follows").findOne({ followerId: viewerId, followingId: targetId });
    isFollowing = Boolean(edge);
  }
  const { email: _e, passwordHash: _p, ..._rest } = user;
  return {
    ...toPublicUser(user),
    ...counts,
    isFollowing,
    isSelf: viewerId === targetId,
  };
}

export async function updateProfile(userId, { displayName, bio, avatar, country }) {
  const updates = { updatedAt: new Date() };
  if (displayName !== undefined) updates.displayName = String(displayName).trim().slice(0, 80);
  if (bio !== undefined) updates.bio = String(bio).trim().slice(0, 500);
  if (avatar !== undefined) updates.avatar = String(avatar).trim().slice(0, 500);
  if (country !== undefined) updates.country = String(country).trim().slice(0, 80);

  const result = await getDb().collection("users").findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updates },
    { returnDocument: "after" }
  );
  if (!result) return null;
  const counts = await followCounts(userId);
  return { ...toPublicUser(result), ...counts };
}

export async function searchUsers(query, excludeUserId, limit = 20) {
  const q = query.trim();
  if (q.length < 2) return [];
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const filter = {
    $or: [{ displayName: regex }, { email: regex }],
    ...(excludeUserId ? { _id: { $ne: new ObjectId(excludeUserId) } } : {}),
  };
  const rows = await getDb()
    .collection("users")
    .find(filter, { projection: { passwordHash: 0 } })
    .limit(limit)
    .toArray();
  return Promise.all(
    rows.map(async (u) => {
      const counts = await followCounts(u._id.toString());
      return { ...toPublicUser(u), ...counts };
    })
  );
}

export async function followUser(followerId, followingId) {
  if (followerId === followingId) {
    const err = new Error("Cannot follow yourself.");
    err.status = 400;
    throw err;
  }
  const target = await getDb().collection("users").findOne({ _id: new ObjectId(followingId) });
  if (!target) {
    const err = new Error("User not found.");
    err.status = 404;
    throw err;
  }
  await getDb().collection("follows").updateOne(
    { followerId, followingId },
    { $setOnInsert: { followerId, followingId, createdAt: new Date() } },
    { upsert: true }
  );
  return getUserProfile(followerId, followingId);
}

export async function unfollowUser(followerId, followingId) {
  await getDb().collection("follows").deleteOne({ followerId, followingId });
  return getUserProfile(followerId, followingId);
}

export async function listFollowers(userId, limit = 50) {
  const edges = await getDb()
    .collection("follows")
    .find({ followingId: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  const users = await Promise.all(
    edges.map(async (e) => {
      const u = await getDb().collection("users").findOne({ _id: new ObjectId(e.followerId) });
      return u ? toPublicUser(u) : null;
    })
  );
  return users.filter(Boolean);
}

export async function listFollowing(userId, limit = 50) {
  const edges = await getDb()
    .collection("follows")
    .find({ followerId: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  const users = await Promise.all(
    edges.map(async (e) => {
      const u = await getDb().collection("users").findOne({ _id: new ObjectId(e.followingId) });
      return u ? toPublicUser(u) : null;
    })
  );
  return users.filter(Boolean);
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
