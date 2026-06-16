import { BrowserRouter, NavLink, Route, Routes, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import { PlayerProvider } from "./player";
import { MiniPlayer } from "./components/MiniPlayer";
import { NowPlayingSheet } from "./components/NowPlayingSheet";
import { ApiBanner } from "./components/ApiBanner";
import { HomePage } from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { SearchPage } from "./pages/SearchPage";
import { LibraryPage } from "./pages/LibraryPage";
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
      <ApiBanner />
      <nav className="tab-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/browse" className={({ isActive }) => (isActive ? "active" : "")}>
          Discover
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : "")}>
          Search
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => (isActive ? "active" : "")}>
          Library
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/browse/:categoryId" element={<CategoryPage />} />
        <Route path="/package/:packageId" element={<PackagePage />} />
        <Route path="/routine/:routineId" element={<RoutinePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <MiniPlayer />
      <NowPlayingSheet />
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
