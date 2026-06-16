import type { PlaybackTrack } from "./api";

const KEY = "bab_recent_v1";
const MAX = 20;

export type RecentPlay = {
  trackId: string;
  title: string;
  packageTitle: string;
  audioUrl: string;
  durationSec: number;
  packageId?: string;
  playedAt: number;
};

export function addRecentPlay(track: PlaybackTrack, packageId?: string) {
  const entry: RecentPlay = {
    trackId: track.taskId,
    title: track.title,
    packageTitle: track.packageTitle,
    audioUrl: track.audioUrl,
    durationSec: track.durationSec,
    packageId,
    playedAt: Date.now(),
  };

  const list = getRecentPlays().filter((r) => r.trackId !== entry.trackId || r.title !== entry.title);
  list.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
}

export function getRecentPlays(): RecentPlay[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearRecentPlays() {
  localStorage.removeItem(KEY);
}
