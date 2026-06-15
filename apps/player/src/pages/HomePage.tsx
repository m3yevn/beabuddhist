import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Routine } from "../api";
import { useAuth } from "../auth";
import { usePlayer } from "../player";

export function HomePage() {
  const { user } = useAuth();
  const { playRoutine } = usePlayer();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
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
        setError("Add chants to this routine first.");
        return;
      }
      playRoutine(playback.title, playback.tracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cannot play");
    }
  }

  return (
    <div className="page">
      <h1>Home</h1>
      {!user ? (
        <p className="muted">
          <Link to="/login">Sign in</Link> to create routines, or <Link to="/browse">browse</Link> the catalog.
        </p>
      ) : (
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
                  <span className="muted">{r.tasks?.length || 0} chants</span>
                </div>
                <div className="card-actions">
                  <button type="button" onClick={() => play(r.id || r._id!)}>▶ Play</button>
                  <Link to={`/routine/${r.id || r._id}`}>Edit</Link>
                </div>
              </li>
            ))}
          </ul>
          {!routines.length && <p className="muted">No routines yet. Create one above.</p>}
        </>
      )}
    </div>
  );
}
