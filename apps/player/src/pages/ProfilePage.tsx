import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api, type Profile } from "../api";
import { useAuth } from "../auth";

export function ProfilePage() {
  const { user, refreshProfile, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName: "", bio: "", country: "", avatar: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    api
      .me()
      .then((r) => {
        setProfile(r.profile);
        setForm({
          displayName: r.profile.displayName,
          bio: r.profile.bio || "",
          country: r.profile.country || "",
          avatar: r.profile.avatar || "",
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load profile"));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  async function save() {
    setSaving(true);
    setError("");
    try {
      const { profile: updated } = await api.updateProfile(form);
      setProfile(updated);
      refreshProfile(updated);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAccount() {
    if (!confirm("Delete your account permanently? Routines and profile data will be removed.")) return;
    setDeleting(true);
    setError("");
    try {
      await api.deleteAccount();
      signOut();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="page">
      <h1>Profile</h1>
      {error && <p className="error small">{error}</p>}
      {profile ? (
        <div className="profile-card">
          <div className="profile-header">
            <span className="profile-avatar">{profile.avatar || "🙏"}</span>
            <div>
              <strong className="profile-name">{profile.displayName}</strong>
              <p className="muted small">{profile.email}</p>
              {profile.country && <p className="muted small">{profile.country}</p>}
            </div>
          </div>
          {profile.bio && !editing && <p className="profile-bio">{profile.bio}</p>}
          <p className="muted small profile-stats">
            {profile.followers ?? 0} followers · {profile.following ?? 0} following
          </p>
          {!editing ? (
            <button type="button" className="btn-ghost" onClick={() => setEditing(true)}>
              Edit profile
            </button>
          ) : (
            <form
              className="profile-form"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <label>
                Display name
                <input
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                />
              </label>
              <label>
                Bio
                <textarea
                  value={form.bio}
                  rows={3}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </label>
              <label>
                Country
                <input
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </label>
              <label>
                Avatar (emoji or URL)
                <input
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        !error && <p className="muted">Loading…</p>
      )}
      <p className="muted small" style={{ marginTop: 24 }}>
        Find practitioners in <Link to="/search">Search</Link>.
      </p>
      <button type="button" className="link-btn" style={{ marginTop: 16 }} onClick={signOut}>
        Sign out
      </button>
      <button
        type="button"
        className="link-btn danger"
        style={{ marginTop: 12 }}
        disabled={deleting}
        onClick={deleteAccount}
      >
        {deleting ? "Deleting…" : "Delete account"}
      </button>
    </div>
  );
}
