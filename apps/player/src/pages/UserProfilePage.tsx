import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type Profile } from "../api";
import { useAuth } from "../auth";

export function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!userId || !user) return;
    api
      .user(userId)
      .then((r) => setProfile(r.profile))
      .catch((e) => setError(e instanceof Error ? e.message : "User not found"));
  }, [userId, user]);

  async function toggleFollow() {
    if (!profile || !userId) return;
    setBusy(true);
    setError("");
    try {
      const fn = profile.isFollowing ? api.unfollow : api.follow;
      const { profile: updated } = await fn(userId);
      setProfile(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <div className="page">
        <p className="muted">
          <Link to="/login">Sign in</Link> to view profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/search" className="back">← Search</Link>
      {error && <p className="error small">{error}</p>}
      {profile ? (
        <div className="profile-card">
          <div className="profile-header">
            <span className="profile-avatar">{profile.avatar || "🙏"}</span>
            <div>
              <strong className="profile-name">{profile.displayName}</strong>
              {profile.country && <p className="muted small">{profile.country}</p>}
            </div>
          </div>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <p className="muted small profile-stats">
            {profile.followers ?? 0} followers · {profile.following ?? 0} following
          </p>
          {!profile.isSelf && (
            <button
              type="button"
              className={profile.isFollowing ? "btn-ghost" : "btn-primary"}
              disabled={busy}
              onClick={toggleFollow}
            >
              {busy ? "…" : profile.isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
          {profile.isSelf && (
            <Link to="/profile" className="btn-ghost">
              Edit your profile
            </Link>
          )}
        </div>
      ) : (
        !error && <p className="muted">Loading…</p>
      )}
    </div>
  );
}
