import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { api, type Profile, type User } from "./api";

type AuthContextValue = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => void;
  refreshProfile: (profile: Profile) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUser(): User | null {
  const raw = localStorage.getItem("bab_user");
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async signIn(email, password) {
        const { token, user } = await api.signIn(email, password);
        localStorage.setItem("bab_token", token);
        localStorage.setItem("bab_user", JSON.stringify(user));
        setUser(user);
      },
      async signUp(email, password, displayName) {
        const { token, user } = await api.signUp(email, password, displayName);
        localStorage.setItem("bab_token", token);
        localStorage.setItem("bab_user", JSON.stringify(user));
        setUser(user);
      },
      signOut() {
        localStorage.removeItem("bab_token");
        localStorage.removeItem("bab_user");
        setUser(null);
      },
      refreshProfile(profile) {
        const next: User = {
          id: profile.id,
          email: profile.email,
          displayName: profile.displayName,
          bio: profile.bio,
          avatar: profile.avatar,
          country: profile.country,
        };
        localStorage.setItem("bab_user", JSON.stringify(next));
        setUser(next);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
