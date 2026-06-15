import { usePlayer, formatTime } from "../player";

export function MiniPlayer() {
  const { currentTrack, routineTitle, isPlaying, toggle, next, prev, currentTime, duration, tracks, seek, setQueueOpen } =
    usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="mini-player" onClick={() => setQueueOpen(true)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setQueueOpen(true)}>
      <div className="mini-player-info">
        <strong>{currentTrack.title}</strong>
        <span>{routineTitle} · tap for queue</span>
      </div>
      <div className="mini-player-controls" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={prev} disabled={tracks.length <= 1} aria-label="Previous">
          ⏮
        </button>
        <button type="button" className="play-btn" onClick={toggle} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button type="button" onClick={next} disabled={tracks.length <= 1} aria-label="Next">
          ⏭
        </button>
      </div>
      <div className="mini-player-progress" onClick={(e) => e.stopPropagation()}>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
