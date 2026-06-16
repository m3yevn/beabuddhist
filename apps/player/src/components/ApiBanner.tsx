import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "https://beabuddhist-api.vercel.app";

export function ApiBanner() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((d) => {
        if (d.database === "NOT_CONFIGURED") {
          setMsg("Sign-in & routines need MongoDB on beabuddhist-api — browse & play work without it.");
        } else if (!d.success) {
          setMsg("API connection issue — using offline catalog.");
        }
      })
      .catch(() => setMsg("Offline mode — catalog cached locally."));
  }, []);

  if (!msg) return null;

  return (
    <div className="api-banner" role="status">
      <span>{msg}</span>
      <a href="https://github.com/m3yevn/beabuddhist/blob/master/SETUP.md" target="_blank" rel="noopener">
        Setup guide
      </a>
    </div>
  );
}
