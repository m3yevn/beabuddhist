import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Routine } from "../api";
import { useAuth } from "../auth";
import { usePlayer } from "../player";
import { getRecentPlays, clearRecentPlays, type RecentPlay } from "../recentPlays";

export function LibraryPage() {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [recent, setRecent] = useState<RecentPlay[]>([]);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setRecent(getRecentPlays());
    if (!user) return;
    api
      .routines()
      .then((r) => setRoutines(r.routines))
      .catch((e) => setAuthError(e instanceof Error ? e.message : "Could not load routines"));
  }, [user]);

  function playRecent(r: RecentPlay) {
    playTrack(r.packageTitle, {
      index: 0,
      taskId: r.trackId,
      title: r.title,
      packageTitle: r.packageTitle,
      audioUrl: r.audioUrl,
      durationSec: r.durationSec,
    });
  }

  return (
    <div className="page">
      <h1>Library</h1>

      <section className="library-section">
        <div className="section-header">
          <h2>Recently played</h2>
          {recent.length > 0 && (
            <button type="button" className="link-btn" onClick={() => { clearRecentPlays(); setRecent([]); }}>
              Clear
            </button>
          )}
        </div>
        {recent.length ? (
          <ul className="track-list">
            {recent.map((r) => (
              <li key={`${r.trackId}-${r.playedAt}`}>
                <button type="button" className="track-row" onClick={() => playRecent(r)}>
                  <span>▶</span>
                  <span>
                    <strong>{r.title}</strong>
                    <span className="muted small block">{r.packageTitle}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Play a chant to see it here.</p>
        )}
      </section>

      <section className="library-section">
        <h2>Your routines</h2>
        {!user ? (
          <p className="muted">
            <Link to="/login">Sign in</Link> to save prayer routines.
          </p>
        ) : authError ? (
          <p className="error small">{authError}</p>
        ) : routines.length ? (
          <ul className="card-list">
            {routines.map((r) => (
              <li key={r.id || r._id} className="card">
                <div>
                  <strong>{r.title}</strong>
                  <span className="muted">{r.tasks?.length || 0} chants</span>
                </div>
                <Link to={`/routine/${r.id || r._id}`}>Open</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            No routines yet. <Link to="/">Create one on Home</Link>.
          </p>
        )}
      </section>
    </div>
  );
}
