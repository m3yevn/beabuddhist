import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategoriesList, prefetchCatalog } from "../catalogIndex";
import { collections, getCollectionPackages, browseTopics, packagesForTopic } from "../curatedCatalog";

export function BrowsePage() {
  const [categories, setCategories] = useState(getCategoriesList());
  const [params] = useSearchParams();
  const collectionId = params.get("collection");
  const collection = collectionId ? collections.find((c) => c.id === collectionId) : null;
  const collectionPackages = collectionId ? getCollectionPackages(collectionId) : [];

  useEffect(() => {
    prefetchCatalog().then(() => setCategories(getCategoriesList()));
  }, []);

  return (
    <div className="page">
      <h1>Discover</h1>
      <p className="muted">Browse sacred audio by tradition, practice, and topic.</p>

      {collection && (
        <section className="home-section">
          <Link to="/browse" className="back">← All categories</Link>
          <div className="collection-hero">
            <span className="emoji large">{collection.coverEmoji}</span>
            <h2>{collection.title}</h2>
            <p className="muted">{collection.description}</p>
          </div>
          <div className="grid">
            {collectionPackages.map((pkg) => (
              <Link key={pkg.id} to={`/package/${pkg.id}`} className="discover-card">
                <span className="emoji">{pkg.coverEmoji}</span>
                <strong>{pkg.title}</strong>
                <span className="muted small">{pkg.tradition}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!collection && (
        <>
          <section className="home-section">
            <h2>Browse by topic</h2>
            <div className="topic-chips">
              {browseTopics.map((t) => (
                <Link key={t.id} to={`/browse/topic/${t.id}`} className="topic-chip">
                  {t.emoji} {t.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="home-section">
            <h2>Categories</h2>
            <div className="grid">
              {categories.map((c) => (
                <Link key={c.id} to={`/browse/${c.id}`} className="discover-card">
                  <span className="emoji">{c.emoji || "📿"}</span>
                  <strong>{c.title}</strong>
                </Link>
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
        </>
      )}
    </div>
  );
}

export function TopicBrowsePage({ topicId }: { topicId: string }) {
  const topic = browseTopics.find((t) => t.id === topicId);
  const packages = packagesForTopic(topicId);

  return (
    <div className="page">
      <Link to="/browse" className="back">← Discover</Link>
      <h1>{topic?.emoji} {topic?.label || topicId}</h1>
      <div className="grid">
        {packages.map((pkg) => (
          <Link key={pkg.id} to={`/package/${pkg.id}`} className="discover-card">
            <span className="emoji">{pkg.coverEmoji}</span>
            <strong>{pkg.title}</strong>
            <span className="muted small">{pkg.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
