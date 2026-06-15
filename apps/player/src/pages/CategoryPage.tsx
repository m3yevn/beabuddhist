import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type Package } from "../api";

export function CategoryPage() {
  const { categoryId } = useParams();
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    if (!categoryId) return;
    api.packages(categoryId).then((r) => setPackages(r.packages));
  }, [categoryId]);

  return (
    <div className="page">
      <Link to="/browse" className="back">← Discover</Link>
      <h1>Packages</h1>
      <ul className="card-list">
        {packages.map((p) => (
          <li key={p.id}>
            <Link to={`/package/${p.id}`} className="card">
              <span className="emoji">{p.coverEmoji}</span>
              <div>
                <strong>{p.title}</strong>
                <span className="muted">{p.tracks.length} track(s)</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
