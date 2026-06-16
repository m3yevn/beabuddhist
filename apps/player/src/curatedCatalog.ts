import type { PlaybackTrack } from "./api";
import { seedPackages, curatedPlaylists, collections, creators } from "./seedCatalog";
import type { Package } from "./api";

export { collections, creators, curatedPlaylists } from "./seedCatalog";

export function getFeaturedPackages(): Package[] {
  return seedPackages.filter((p) => p.isFeatured);
}

export function getNewPackages(): Package[] {
  return seedPackages.filter((p) => p.isNew);
}

export function getCreator(id: string) {
  return creators.find((c) => c.id === id);
}

export function resolvePlaylistTracks(playlistId: string): PlaybackTrack[] {
  const playlist = curatedPlaylists.find((p) => p.id === playlistId);
  if (!playlist) return [];

  const tracks: PlaybackTrack[] = [];
  let index = 0;
  for (const ref of playlist.trackRefs) {
    const pkg = seedPackages.find((p) => p.id === ref.packageId);
    const track = pkg?.tracks.find((t) => t.id === ref.trackId);
    if (!pkg || !track) continue;
    tracks.push({
      index: index++,
      taskId: `${ref.packageId}-${ref.trackId}`,
      title: track.title,
      packageTitle: pkg.title,
      audioUrl: track.audioUrl,
      durationSec: track.durationSec,
    });
  }
  return tracks;
}

export function getCollectionPackages(collectionId: string): Package[] {
  const col = collections.find((c) => c.id === collectionId);
  if (!col) return [];
  return col.packageIds
    .map((id) => seedPackages.find((p) => p.id === id))
    .filter((p): p is Package => Boolean(p));
}

export const browseTopics = [
  { id: "chanting", label: "Chanting", emoji: "📿" },
  { id: "meditation", label: "Meditation", emoji: "🧘" },
  { id: "dharma", label: "Study", emoji: "📖" },
  { id: "instrumental", label: "Ambient", emoji: "🔔" },
  { id: "learning", label: "Learning", emoji: "🎓" },
];

export function packagesForTopic(topicId: string): Package[] {
  const map: Record<string, string[]> = {
    chanting: ["chanting-pali", "chanting-sanskrit", "chanting-mahayana"],
    meditation: ["meditation-guided", "meditation-mindfulness"],
    dharma: ["dharma"],
    instrumental: ["instrumental"],
    learning: ["learning"],
  };
  const cats = map[topicId] || [];
  return seedPackages.filter((p) => cats.includes(p.categoryId));
}
