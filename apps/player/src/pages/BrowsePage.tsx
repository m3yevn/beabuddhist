import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoriesList, prefetchCatalog } from "../catalogIndex";

export function BrowsePage() {
  const [categories, setCategories] = useState(getCategoriesList());

  useEffect(() => {
    prefetchCatalog().then(() => setCategories(getCategoriesList()));
  }, []);

  return (
    <div className="page">
      <h1>Discover</h1>
      <p className="muted">Browse sacred audio by tradition and practice.</p>
      <div className="grid">
        {categories.map((c) => (
          <Link key={c.id} to={`/browse/${c.id}`} className="discover-card">
            <span className="emoji">📿</span>
            <strong>{c.title}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
