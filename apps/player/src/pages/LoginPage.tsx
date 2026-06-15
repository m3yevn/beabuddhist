import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth";

export function LoginPage() {
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "in") await signIn(email, password);
      else await signUp(email, password, name || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>🙏 Be A Buddhist</h1>
      <p className="muted">Sign in to save your prayer routines</p>
      <form onSubmit={submit} className="auth-form">
        {mode === "up" && (
          <input placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button type="button" className="link-btn" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
      <Link to="/" className="muted small">Browse catalog without account →</Link>
    </div>
  );
}
