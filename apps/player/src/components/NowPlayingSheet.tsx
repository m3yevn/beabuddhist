import { usePlayer, formatTime } from "../player";

export function NowPlayingSheet() {
  const {
    queueOpen,
    setQueueOpen,
    tracks,
    routineTitle,
    currentIndex,
    currentTrack,
    isPlaying,
    toggle,
    next,
    prev,
    currentTime,
    duration,
    seek,
    jumpTo,
  } = usePlayer();

  if (!queueOpen || !currentTrack) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="now-playing-backdrop" onClick={() => setQueueOpen(false)} role="presentation">
      <div
        className="now-playing-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Now playing"
      >
        <button type="button" className="sheet-close" onClick={() => setQueueOpen(false)} aria-label="Close">
          ↓
        </button>
        <p className="sheet-label">{routineTitle}</p>
        <h2 className="sheet-title">{currentTrack.title}</h2>
        <p className="muted small">{currentTrack.packageTitle}</p>

        <div className="sheet-progress">
          <div className="sheet-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="sheet-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          className="sheet-seek"
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
        />

        <div className="sheet-controls">
          <button type="button" onClick={prev} disabled={tracks.length <= 1} aria-label="Previous">
            ⏮
          </button>
          <button type="button" className="play-btn large" onClick={toggle} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button type="button" onClick={next} disabled={tracks.length <= 1} aria-label="Next">
            ⏭
          </button>
        </div>

        {tracks.length > 1 && (
          <div className="queue-section">
            <h3>Queue</h3>
            <ul className="queue-list">
              {tracks.map((t, i) => (
                <li key={`${t.taskId}-${i}`}>
                  <button
                    type="button"
                    className={i === currentIndex ? "queue-item active" : "queue-item"}
                    onClick={() => jumpTo(i)}
                  >
                    <span className="queue-num">{i + 1}</span>
                    <span>{t.title}</span>
                    {i === currentIndex && isPlaying && <span className="queue-live">▶</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
