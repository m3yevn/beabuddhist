import {
  getCachedCategories,
  getCachedPackage,
  getCachedPackages,
  setCachedCategories,
  setCachedPackage,
  setCachedPackages,
} from "./catalogCache";
import { seedCategories, seedPackages } from "./seedCatalog";

const API_BASE = import.meta.env.VITE_API_URL || "https://beabuddhist-api.vercel.app";

export type User = {
  id: string;
  email: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  country?: string;
};

export type Profile = User & {
  followers?: number;
  following?: number;
  isFollowing?: boolean;
  isSelf?: boolean;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("bab_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data as T;
}

export const api = {
  signUp: (email: string, password: string, displayName?: string) =>
    request<{ token: string; user: User }>("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify({ email, password, displayName }),
    }),
  signIn: (email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  async categories() {
    try {
      const data = await request<{ categories: Category[] }>("/catalog/categories");
      setCachedCategories(data.categories);
      return data;
    } catch {
      const cached = getCachedCategories<Category[]>();
      if (cached) return { categories: cached };
      setCachedCategories(seedCategories);
      return { categories: seedCategories };
    }
  },
  async packages(categoryId: string) {
    try {
      const data = await request<{ packages: Package[] }>(`/catalog/categories/${categoryId}/packages`);
      setCachedPackages(categoryId, data.packages);
      for (const p of data.packages) setCachedPackage(p.id, p);
      return data;
    } catch {
      const cached = getCachedPackages<Package[]>(categoryId);
      if (cached) return { packages: cached };
      const seeded = seedPackages.filter((p) => p.categoryId === categoryId);
      setCachedPackages(categoryId, seeded);
      return { packages: seeded };
    }
  },
  async package(id: string) {
    try {
      const data = await request<{ package: Package }>(`/catalog/packages/${id}`);
      setCachedPackage(id, data.package);
      return data;
    } catch {
      const cached = getCachedPackage<Package>(id);
      if (cached) return { package: cached };
      const seeded = seedPackages.find((p) => p.id === id);
      if (seeded) return { package: seeded };
      throw new Error("Package not found");
    }
  },
  routines: () => request<{ routines: Routine[] }>("/routines"),
  createRoutine: (title: string) =>
    request<{ routine: Routine }>("/routines", { method: "POST", body: JSON.stringify({ title }) }),
  routine: (id: string) => request<{ routine: Routine }>(`/routines/${id}`),
  deleteRoutine: (id: string) => request<{ success: boolean }>(`/routines/${id}`, { method: "DELETE" }),
  addTask: (routineId: string, packageId: string, trackId?: string) =>
    request<{ routine: Routine }>(`/routines/${routineId}/tasks`, {
      method: "POST",
      body: JSON.stringify({ packageId, trackId }),
    }),
  removeTask: (routineId: string, taskId: string) =>
    request<{ routine: Routine }>(`/routines/${routineId}/tasks/${taskId}`, { method: "DELETE" }),
  playback: (routineId: string) =>
    request<{ playback: Playback }>(`/routines/${routineId}/playback`),
  me: () => request<{ profile: Profile }>("/users/me"),
  updateProfile: (body: Partial<Pick<Profile, "displayName" | "bio" | "avatar" | "country">>) =>
    request<{ profile: Profile }>("/users/me", { method: "PATCH", body: JSON.stringify(body) }),
  user: (id: string) => request<{ profile: Profile }>(`/users/${id}`),
  searchUsers: (q: string) =>
    request<{ users: Profile[] }>(`/users/search?q=${encodeURIComponent(q)}`),
  follow: (id: string) =>
    request<{ profile: Profile }>(`/users/${id}/follow`, { method: "POST" }),
  unfollow: (id: string) =>
    request<{ profile: Profile }>(`/users/${id}/follow`, { method: "DELETE" }),
  followers: (id: string) => request<{ users: Profile[] }>(`/users/${id}/followers`),
  following: (id: string) => request<{ users: Profile[] }>(`/users/${id}/following`),
};

export type Category = { id: string; title: string; order: number };
export type Track = { id: string; title: string; audioUrl: string; durationSec: number };
export type Package = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  coverEmoji: string;
  tracks: Track[];
};
export type RoutineTask = {
  id: string;
  packageId: string;
  title: string;
  audioUrl: string;
  packageTitle: string;
};
export type Routine = {
  id: string;
  _id?: string;
  title: string;
  tasks: RoutineTask[];
};
export type PlaybackTrack = {
  index: number;
  taskId: string;
  title: string;
  packageTitle: string;
  audioUrl: string;
  durationSec: number;
};
export type Playback = {
  routineId: string;
  title: string;
  tracks: PlaybackTrack[];
};
