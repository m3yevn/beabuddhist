import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Category } from "../api";

export function BrowsePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.categories().then((r) => setCategories(r.categories));
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
