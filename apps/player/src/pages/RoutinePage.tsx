import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, type Routine } from "../api";
import { useAuth } from "../auth";
import { usePlayer } from "../player";

export function RoutinePage() {
  const { routineId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { playRoutine } = usePlayer();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user || !routineId) return;
    api.routine(routineId).then((r) => setRoutine(r.routine));
  }, [user, routineId]);

  if (!user) {
    return (
      <div className="page">
        <p><Link to="/login">Sign in</Link> to edit routines.</p>
      </div>
    );
  }

  if (!routine) return <div className="page muted">Loading…</div>;

  async function removeTask(taskId: string) {
    if (!routineId) return;
    const { routine: updated } = await api.removeTask(routineId, taskId);
    setRoutine(updated);
  }

  async function play() {
    if (!routineId) return;
    const { playback } = await api.playback(routineId);
    if (!playback.tracks.length) {
      setMsg("Add chants from Browse first.");
      return;
    }
    playRoutine(playback.title, playback.tracks);
  }

  async function deleteRoutine() {
    if (!routineId || !confirm("Delete this routine?")) return;
    await api.deleteRoutine(routineId);
    navigate("/");
  }

  return (
    <div className="page">
      <Link to="/" className="back">← Routines</Link>
      <h1>{routine.title}</h1>
      {msg && <p className="error">{msg}</p>}
      <div className="actions-row">
        <button type="button" className="btn-primary" onClick={play}>▶ Play routine</button>
        <Link to="/browse" className="btn-ghost">+ Add from browse</Link>
        <button type="button" className="link-btn danger" onClick={deleteRoutine}>Delete</button>
      </div>
      <p className="muted small">To add a chant: open a package in Browse, then use “Add to routine” (coming in next patch) — for now add via API or pick packages below.</p>
      <ul className="track-list">
        {routine.tasks?.map((t) => (
          <li key={t.id} className="track-row static">
            <span>{t.title}</span>
            <span className="muted">{t.packageTitle}</span>
            <button type="button" onClick={() => removeTask(t.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {!routine.tasks?.length && <p className="muted">No chants yet.</p>}
      <AddFromBrowse routineId={routineId!} onAdded={setRoutine} />
    </div>
  );
}

function AddFromBrowse({ routineId, onAdded }: { routineId: string; onAdded: (r: Routine) => void }) {
  const [packages, setPackages] = useState<{ id: string; title: string; coverEmoji: string }[]>([]);

  useEffect(() => {
    api.categories().then(async (cats) => {
      const all: { id: string; title: string; coverEmoji: string }[] = [];
      for (const c of cats.categories) {
        const { packages } = await api.packages(c.id);
        all.push(...packages.map((p) => ({ id: p.id, title: p.title, coverEmoji: p.coverEmoji })));
      }
      setPackages(all);
    });
  }, []);

  return (
    <div className="add-section">
      <h2>Quick add</h2>
      <div className="grid small">
        {packages.map((p) => (
          <button
            key={p.id}
            type="button"
            className="discover-card"
            onClick={async () => {
              const { routine } = await api.addTask(routineId, p.id);
              onAdded(routine);
            }}
          >
            <span>{p.coverEmoji}</span> {p.title}
          </button>
        ))}
      </div>
    </div>
  );
}
