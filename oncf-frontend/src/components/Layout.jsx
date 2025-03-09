import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">ONCF Report System</div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/epaves">Epaves</Link></li>
            <li><Link to="/fiches-infraction">Fiches d'infraction</Link></li>
            <li><Link to="/cartes-perimee">Cartes périmées</Link></li>
            <li><Link to="/employees">Employés</Link></li>
          </ul>
        </nav>
        <div className="user-menu">
          <span className="username">User</span>
          <Link to="/login" className="logout-button">Logout</Link>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2025 ONCF Report System</p>
      </footer>
    </div>
  );
}

export default Layout;