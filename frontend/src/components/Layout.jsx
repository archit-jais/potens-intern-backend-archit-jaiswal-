import { NavLink } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <p className="brand-eyebrow">Potens Q2</p>
            <h1>Internship Recommender</h1>
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/recommend">Recommend</NavLink>
          <NavLink to="/catalogue">Catalogue</NavLink>
        </nav>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
