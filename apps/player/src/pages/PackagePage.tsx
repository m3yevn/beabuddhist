import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type Package } from "../api";
import { AddToRoutine } from "../components/AddToRoutine";
import { usePlayer } from "../player";
import { getCreator } from "../curatedCatalog";
import { formatTime } from "../player";

export function PackagePage() {
  const { packageId } = useParams();
  const { playTrack } = usePlayer();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!packageId) return;
    api
      .package(packageId)
      .then((r) => {
        setPkg(r.package);
        setOffline(false);
      })
      .catch(() => setOffline(true));
  }, [packageId]);

  if (!pkg) return <div className="page muted">Loading…</div>;

  const creator = pkg.creatorId ? getCreator(pkg.creatorId) : null;
  const hasPlaceholder = pkg.tracks.some((t) => t.isPlaceholderAudio);

  return (
    <div className="page">
      <Link to={`/browse/${pkg.categoryId}`} className="back">← Back</Link>
      {offline && <p className="muted small">Showing cached catalog (offline).</p>}
      {hasPlaceholder && (
        <p className="integrity-notice">Demo audio — calm ambience placeholder until licensed recordings are added.</p>
      )}
      <div className="package-hero">
        <span className="emoji large">{pkg.coverEmoji}</span>
        <h1>{pkg.title}</h1>
        <p className="muted">{pkg.description}</p>
        <div className="meta-tags">
          {pkg.genre && <span className="tag">{pkg.genre}</span>}
          {pkg.tradition && <span className="tag">{pkg.tradition}</span>}
          {pkg.contentType && <span className="tag">{pkg.contentType}</span>}
        </div>
        {creator && (
          <p className="creator-line muted small">
            🙏 {creator.name} · {creator.tradition}
          </p>
        )}
        <AddToRoutine packageId={pkg.id} />
      </div>
      <ul className="track-list">
        {pkg.tracks.map((t) => (
          <li key={t.id} className="track-list-item">
            <button
              type="button"
              className="track-row"
              onClick={() =>
                playTrack(pkg.title, {
                  index: 0,
                  taskId: t.id,
                  title: t.title,
                  packageTitle: pkg.title,
                  audioUrl: t.audioUrl,
                  durationSec: t.durationSec,
                })
              }
            >
              <span>▶</span>
              <span className="track-info">
                <strong>{t.title}</strong>
                <span className="muted small">
                  {formatTime(t.durationSec)}
                  {t.genre ? ` · ${t.genre}` : ""}
                  {t.mood ? ` · ${t.mood}` : ""}
                  {t.isPlaceholderAudio ? " · demo audio" : ""}
                </span>
              </span>
            </button>
            <AddToRoutine packageId={pkg.id} trackId={t.id} trackTitle={t.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
