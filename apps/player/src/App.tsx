import { BrowserRouter, NavLink, Route, Routes, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import { PlayerProvider } from "./player";
import { MiniPlayer } from "./components/MiniPlayer";
import { HomePage } from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { CategoryPage } from "./pages/CategoryPage";
import { PackagePage } from "./pages/PackagePage";
import { RoutinePage } from "./pages/RoutinePage";
import { LoginPage } from "./pages/LoginPage";

function Shell() {
  const { user, signOut } = useAuth();

  return (
    <div className="app-shell">
      <header className="top-bar">
        <Link to="/" className="brand">🙏 Be A Buddhist</Link>
        <div>
          {user ? (
            <button type="button" className="link-btn" onClick={signOut}>
              {user.displayName} · Sign out
            </button>
          ) : (
            <NavLink to="/login">Sign in</NavLink>
          )}
        </div>
      </header>
      <nav className="tab-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/browse" className={({ isActive }) => (isActive ? "active" : "")}>
          Discover
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/browse/:categoryId" element={<CategoryPage />} />
        <Route path="/package/:packageId" element={<PackagePage />} />
        <Route path="/routine/:routineId" element={<RoutinePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <MiniPlayer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter basename="/app">
          <Shell />
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
}
