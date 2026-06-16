import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Routine } from "../api";
import { useAuth } from "../auth";
import { usePlayer } from "../player";
import { prefetchCatalog } from "../catalogIndex";
import {
  getFeaturedPackages,
  getNewPackages,
  collections,
  curatedPlaylists,
  resolvePlaylistTracks,
  creators,
} from "../curatedCatalog";

export function HomePage() {
  const { user } = useAuth();
  const { playRoutine } = usePlayer();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const featured = getFeaturedPackages();
  const newest = getNewPackages();

  useEffect(() => {
    prefetchCatalog();
    if (!user) return;
    api.routines().then((r) => setRoutines(r.routines)).catch(() => setRoutines([]));
  }, [user]);

  async function createRoutine(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !user) return;
    try {
      const { routine } = await api.createRoutine(title.trim());
      setRoutines((prev) => [...prev, routine]);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  async function play(id: string) {
    try {
      const { playback } = await api.playback(id);
      if (!playback.tracks.length) {
        setError("Add tracks to this routine first.");
        return;
      }
      playRoutine(playback.title, playback.tracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cannot play");
    }
  }

  function playCurated(playlistId: string, playlistTitle: string) {
    const tracks = resolvePlaylistTracks(playlistId);
    if (!tracks.length) return;
    playRoutine(playlistTitle, tracks);
  }

  return (
    <div className="page home-page">
      <section className="home-hero">
        <p className="home-greeting">Welcome — may your practice be peaceful.</p>
        <h1>Discover</h1>
        <p className="muted">Chanting, meditation, teachings, and calm ambience for daily practice.</p>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Featured</h2>
          <Link to="/browse" className="section-link">Browse all</Link>
        </div>
        <div className="h-scroll">
          {featured.map((pkg) => (
            <Link key={pkg.id} to={`/package/${pkg.id}`} className="media-card">
              <span className="emoji large">{pkg.coverEmoji}</span>
              <strong>{pkg.title}</strong>
              <span className="muted small">{pkg.genre} · {pkg.tradition}</span>
            </Link>
          ))}
        </div>
      </section>

      {newest.length > 0 && (
        <section className="home-section">
          <h2>New additions</h2>
          <div className="h-scroll">
            {newest.map((pkg) => (
              <Link key={pkg.id} to={`/package/${pkg.id}`} className="media-card compact">
                <span className="emoji">{pkg.coverEmoji}</span>
                <strong>{pkg.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="home-section">
        <h2>Curated playlists</h2>
        <div className="grid small">
          {curatedPlaylists.map((pl) => (
            <button
              key={pl.id}
              type="button"
              className="playlist-card"
              onClick={() => playCurated(pl.id, pl.title)}
            >
              <span className="emoji">{pl.coverEmoji}</span>
              <strong>{pl.title}</strong>
              <span className="muted small">{pl.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>Collections</h2>
        <div className="grid">
          {collections.map((col) => (
            <Link key={col.id} to={`/browse?collection=${col.id}`} className="discover-card">
              <span className="emoji">{col.coverEmoji}</span>
              <strong>{col.title}</strong>
              <span className="muted small">{col.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Your routines</h2>
          {!user && <Link to="/login" className="section-link">Sign in</Link>}
        </div>
        {user ? (
          <>
            <form onSubmit={createRoutine} className="inline-form">
              <input placeholder="New routine name…" value={title} onChange={(e) => setTitle(e.target.value)} />
              <button type="submit" className="btn-primary">Create</button>
            </form>
            {error && <p className="error">{error}</p>}
            <ul className="card-list">
              {routines.map((r) => (
                <li key={r.id || r._id} className="card">
                  <div>
                    <strong>{r.title}</strong>
                    <span className="muted">{r.tasks?.length || 0} tracks</span>
                  </div>
                  <div className="card-actions">
                    <button type="button" onClick={() => play(r.id || r._id!)}>▶ Play</button>
                    <Link to={`/routine/${r.id || r._id}`}>Edit</Link>
                  </div>
                </li>
              ))}
            </ul>
            {!routines.length && (
              <p className="muted">No routines yet — or play a curated playlist above.</p>
            )}
          </>
        ) : (
          <p className="muted">
            <Link to="/login">Sign in</Link> to save prayer routines, or browse without an account.
          </p>
        )}
      </section>

      <section className="home-section teachers-section">
        <h2>Teachers & sources</h2>
        <div className="grid small">
          {creators.map((creator) => (
            <div key={creator.id} className="teacher-card">
              <span className="emoji">🙏</span>
              <strong>{creator.name}</strong>
              <span className="muted small">{creator.tradition} · {creator.role}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
