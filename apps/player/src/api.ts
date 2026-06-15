import {
  getCachedCategories,
  getCachedPackage,
  getCachedPackages,
  setCachedCategories,
  setCachedPackage,
  setCachedPackages,
} from "./catalogCache";

const API_BASE = import.meta.env.VITE_API_URL || "https://api-brown-iota.vercel.app";

export type User = { id: string; email: string; displayName: string };

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
    } catch (e) {
      const cached = getCachedCategories<Category[]>();
      if (cached) return { categories: cached };
      throw e;
    }
  },
  async packages(categoryId: string) {
    try {
      const data = await request<{ packages: Package[] }>(`/catalog/categories/${categoryId}/packages`);
      setCachedPackages(categoryId, data.packages);
      return data;
    } catch (e) {
      const cached = getCachedPackages<Package[]>(categoryId);
      if (cached) return { packages: cached };
      throw e;
    }
  },
  async package(id: string) {
    try {
      const data = await request<{ package: Package }>(`/catalog/packages/${id}`);
      setCachedPackage(id, data.package);
      return data;
    } catch (e) {
      const cached = getCachedPackage<Package>(id);
      if (cached) return { package: cached };
      throw e;
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
