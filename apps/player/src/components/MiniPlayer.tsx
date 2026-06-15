import { usePlayer, formatTime } from "../player";

export function MiniPlayer() {
  const { currentTrack, routineTitle, isPlaying, toggle, next, prev, currentTime, duration, tracks, seek } =
    usePlayer();

  if (!currentTrack) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mini-player">
      <div className="mini-player-info">
        <strong>{currentTrack.title}</strong>
        <span>{routineTitle}</span>
      </div>
      <div className="mini-player-controls">
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
      <div className="mini-player-progress">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
