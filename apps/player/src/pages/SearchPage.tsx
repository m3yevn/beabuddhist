import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { prefetchCatalog, searchCatalog, getPackageById, type SearchHit } from "../catalogIndex";
import { usePlayer } from "../player";
import { useAuth } from "../auth";
import { api, type Profile } from "../api";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const { playTrack } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    prefetchCatalog();
  }, []);

  useEffect(() => {
    setHits(searchCatalog(query));
  }, [query]);

  useEffect(() => {
    if (!user || query.trim().length < 2) {
      setPeople([]);
      return;
    }
    const t = setTimeout(() => {
      api.searchUsers(query.trim()).then((r) => setPeople(r.users)).catch(() => setPeople([]));
    }, 300);
    return () => clearTimeout(t);
  }, [query, user]);

  return (
    <div className="page">
      <h1>Search</h1>
      <input
        className="search-input"
        type="search"
        placeholder="Chants, packages, people…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {!query.trim() && (
        <p className="muted">Try “metta”, “breath”, or search for practitioners by name.</p>
      )}

      {user && people.length > 0 && (
        <section className="library-section">
          <h2>People</h2>
          <ul className="card-list">
            {people.map((p) => (
              <li key={p.id} className="card">
                <div>
                  <strong>{p.avatar || "🙏"} {p.displayName}</strong>
                  {p.bio && <span className="muted small block">{p.bio.slice(0, 60)}</span>}
                </div>
                <Link to={`/profile/${p.id}`}>View</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {user && query.trim().length >= 2 && !people.length && (
        <p className="muted small">No people found for “{query}”.</p>
      )}

      {!user && query.trim().length >= 2 && (
        <p className="muted small">
          <Link to="/login">Sign in</Link> to search practitioners.
        </p>
      )}

      <section className="library-section">
        {query.trim() ? <h2>Catalog</h2> : null}
        <ul className="search-results">
        {hits.map((h) => (
          <li key={`${h.type}-${h.packageId}-${h.trackId || ""}`}>
            {h.type === "package" ? (
              <Link to={`/package/${h.packageId}`} className="search-hit">
                <span className="emoji">{h.coverEmoji}</span>
                <div>
                  <strong>{h.packageTitle}</strong>
                  <span className="muted small">Package</span>
                </div>
              </Link>
            ) : (
              <button
                type="button"
                className="search-hit"
                onClick={() => {
                  const pkg = getPackageById(h.packageId);
                  const track = pkg?.tracks.find((t) => t.id === h.trackId);
                  if (!track) return;
                  playTrack(h.packageTitle, {
                    index: 0,
                    taskId: track.id,
                    title: track.title,
                    packageTitle: h.packageTitle,
                    audioUrl: track.audioUrl,
                    durationSec: track.durationSec,
                  });
                }}
              >
                <span className="emoji">{h.coverEmoji}</span>
                <div>
                  <strong>{h.trackTitle}</strong>
                  <span className="muted small">{h.packageTitle}</span>
                </div>
              </button>
            )}
          </li>
        ))}
        </ul>
        {query.trim() && !hits.length && <p className="muted">No catalog results for “{query}”.</p>}
      </section>
    </div>
  );
}
