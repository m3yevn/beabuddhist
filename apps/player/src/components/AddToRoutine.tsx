import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, type Routine } from "../api";
import { useAuth } from "../auth";

export function AddToRoutine({
  packageId,
  trackId,
  trackTitle,
}: {
  packageId: string;
  trackId?: string;
  trackTitle?: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user || !open) return;
    api.routines().then((r) => setRoutines(r.routines)).catch(() => setRoutines([]));
  }, [user, open]);

  if (!user) {
    return (
      <p className="muted small">
        <Link to="/login">Sign in</Link> to add chants to a routine.
      </p>
    );
  }

  async function add(routineId: string) {
    try {
      await api.addTask(routineId, packageId, trackId);
      setMsg(`Added${trackTitle ? ` “${trackTitle}”` : ""} to routine.`);
      setOpen(false);
      setTimeout(() => navigate(`/routine/${routineId}`), 600);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not add");
    }
  }

  return (
    <div className="add-to-routine">
      <button type="button" className="btn-ghost" onClick={() => setOpen((o) => !o)}>
        + Add to routine
      </button>
      {msg && <p className="small muted">{msg}</p>}
      {open && (
        <div className="routine-picker">
          {routines.length ? (
            <ul>
              {routines.map((r) => (
                <li key={r.id || r._id}>
                  <button type="button" onClick={() => add(r.id || r._id!)}>
                    {r.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">
              No routines yet. <Link to="/">Create one on Home</Link>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
