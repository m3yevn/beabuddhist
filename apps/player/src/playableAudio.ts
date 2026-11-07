import { seedPackages } from "./seedCatalog";

const UNPLAYABLE = /(?:pixabay\.com|soundhelix\.com|procedural:\/\/)/i;

type TrackLike = {
  id: string;
  title?: string;
  audioUrl?: string;
  isPlaceholderAudio?: boolean;
};

type PackageLike = {
  id: string;
  tracks?: TrackLike[];
};

export function isUnplayableAudio(url?: string) {
  if (!url) return true;
  return UNPLAYABLE.test(url);
}

export function packageNeedsSeedAudio(pkg: PackageLike) {
  return (pkg.tracks || []).some((track) => track.isPlaceholderAudio || isUnplayableAudio(track.audioUrl));
}

/** Prefer the bundled catalog when the API still serves dead placeholder files. */
export function preferSeedPackage<T extends PackageLike>(pkg: T): T {
  if (!packageNeedsSeedAudio(pkg)) return pkg;
  const seed = seedPackages.find((item) => item.id === pkg.id);
  return (seed as T) || pkg;
}

export function resolvePlayableUrl(track: { audioUrl?: string; taskId?: string; trackId?: string; title?: string }) {
  const url = track.audioUrl || "";
  if (url && !isUnplayableAudio(url)) return url;

  const ids = [track.trackId, track.taskId].filter((id): id is string => Boolean(id));
  for (const pkg of seedPackages) {
    for (const item of pkg.tracks) {
      const idMatch = ids.some((id) => id === item.id || (id.endsWith(`-${item.id}`) && id.length > item.id.length));
      const titleMatch = Boolean(track.title) && item.title === track.title;
      if ((idMatch || titleMatch) && item.audioUrl && !isUnplayableAudio(item.audioUrl)) {
        return item.audioUrl;
      }
    }
  }
  return url;
}
