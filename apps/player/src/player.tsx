import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PlaybackTrack } from "./api";
import { addRecentPlay } from "./recentPlays";

type PlayerContextValue = {
  tracks: PlaybackTrack[];
  routineTitle: string;
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrack: PlaybackTrack | null;
  queueOpen: boolean;
  setQueueOpen: (open: boolean) => void;
  playRoutine: (title: string, list: PlaybackTrack[]) => void;
  playTrack: (title: string, track: PlaybackTrack) => void;
  jumpTo: (index: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef(new Audio());
  const tracksRef = useRef<PlaybackTrack[]>([]);
  const indexRef = useRef(0);

  const [tracks, setTracks] = useState<PlaybackTrack[]>([]);
  const [routineTitle, setRoutineTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queueOpen, setQueueOpen] = useState(false);

  const playIndex = useCallback((list: PlaybackTrack[], index: number) => {
    const track = list[index];
    if (!track) return;
    const audio = audioRef.current;
    audio.src = track.audioUrl;
    audio.load();
    audio.onloadedmetadata = () => setDuration(audio.duration || track.durationSec || 0);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onended = () => {
      const next = indexRef.current + 1;
      if (next < tracksRef.current.length) {
        indexRef.current = next;
        setCurrentIndex(next);
        playIndex(tracksRef.current, next);
      } else {
        setIsPlaying(false);
      }
    };
    audio.play().then(() => {
      setIsPlaying(true);
      const t = list[index];
      if (t) addRecentPlay(t);
    }).catch(() => setIsPlaying(false));
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({
      tracks,
      routineTitle,
      currentIndex,
      isPlaying,
      currentTime,
      duration,
      currentTrack: tracks[currentIndex] ?? null,
      queueOpen,
      setQueueOpen,
      playRoutine(title, list) {
        setRoutineTitle(title);
        setTracks(list);
        tracksRef.current = list;
        indexRef.current = 0;
        setCurrentIndex(0);
        setQueueOpen(true);
        playIndex(list, 0);
      },
      playTrack(title, track) {
        const list = [{ ...track, index: 0, taskId: track.taskId || "single" }];
        setRoutineTitle(title);
        setTracks(list);
        tracksRef.current = list;
        indexRef.current = 0;
        setCurrentIndex(0);
        playIndex(list, 0);
      },
      jumpTo(index) {
        if (index < 0 || index >= tracksRef.current.length) return;
        indexRef.current = index;
        setCurrentIndex(index);
        playIndex(tracksRef.current, index);
      },
      toggle() {
        const audio = audioRef.current;
        if (!audio.src) return;
        if (audio.paused) {
          audio.play().then(() => setIsPlaying(true));
        } else {
          audio.pause();
          setIsPlaying(false);
        }
      },
      next() {
        const next = indexRef.current + 1;
        if (next < tracksRef.current.length) {
          indexRef.current = next;
          setCurrentIndex(next);
          playIndex(tracksRef.current, next);
        }
      },
      prev() {
        const prev = indexRef.current - 1;
        if (prev >= 0) {
          indexRef.current = prev;
          setCurrentIndex(prev);
          playIndex(tracksRef.current, prev);
        }
      },
      seek(time) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      },
    }),
    [tracks, routineTitle, currentIndex, isPlaying, currentTime, duration, queueOpen, playIndex]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer outside PlayerProvider");
  return ctx;
}

export function formatTime(sec: number) {
  if (!sec || !Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
