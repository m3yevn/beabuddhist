import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { prefetchCatalog, searchCatalog, getPackageById, type SearchHit } from "../catalogIndex";
import { usePlayer } from "../player";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const { playTrack } = usePlayer();

  useEffect(() => {
    prefetchCatalog();
  }, []);

  useEffect(() => {
    setHits(searchCatalog(query));
  }, [query]);

  return (
    <div className="page">
      <h1>Search</h1>
      <input
        className="search-input"
        type="search"
        placeholder="Chants, packages, traditions…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {!query.trim() && <p className="muted">Try “metta”, “breath”, or “refuge”.</p>}
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
      {query.trim() && !hits.length && <p className="muted">No results for “{query}”.</p>}
    </div>
  );
}
