import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaFileContract, FaCreditCard, FaUsers, FaIdBadge, FaBars, FaTimes, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import oncfLogo from '../assets/oncf.png';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuth(); // Get the authenticated user from context
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Check if the current path matches the nav item
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Generate user's initials for the avatar
  const getUserInitials = () => {
    if (!user) return 'UN';
    
    // If we have employee data with nom and prenom
    if (user.nom && user.prenom) {
      return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
    }
    
    // Fallback to using username
    return user.username.substring(0, 2).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return 'Username';
    
    // If we have employee data with nom and prenom
    if (user.nom && user.prenom) {
      return `${user.prenom} ${user.nom}`;
    }
    
    // Fallback to using username
    return user.username;
  };

  // Get formatted role name
  const getFormattedRole = () => {
    if (!user) return 'Admin';
    
    switch (user.role) {
      case 'AGENT_COM':
        return 'Agent Commercial';
      case 'CHEF_SECT':
        return 'Chef de Section';
      case 'CHEF_ANTE':
        return 'Chef d\'Antenne';
      default:
        return user.role || 'Admin';
    }
  };

  return (
    <div className="app-container with-sidebar">
      {/* Sidebar toggle button for mobile */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={oncfLogo} alt="ONCF Logo" className="logo-img" />
            <span className="logo-text">ONCF Report</span>
          </div>
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul>
              <li className={isActive('/') ? 'active' : ''}>
                <Link to="/">
                  <FaTachometerAlt className="nav-icon" />
                  <span className="nav-text">Dashboard</span>
                  {isActive('/') && <FaChevronRight className="active-indicator" />}
                </Link>
              </li>
              <li className={isActive('/epaves') ? 'active' : ''}>
                <Link to="/epaves">
                  <FaBoxOpen className="nav-icon" />
                  <span className="nav-text">Epaves</span>
                  {isActive('/epaves') && <FaChevronRight className="active-indicator" />}
                </Link>
              </li>
              <li className={isActive('/fiches-infraction') ? 'active' : ''}>
                <Link to="/fiches-infraction">
                  <FaFileContract className="nav-icon" />
                  <span className="nav-text">Fiches d'infraction</span>
                  {isActive('/fiches-infraction') && <FaChevronRight className="active-indicator" />}
                </Link>
              </li>
              <li className={isActive('/cartes-perimee') ? 'active' : ''}>
                <Link to="/cartes-perimee">
                  <FaCreditCard className="nav-icon" />
                  <span className="nav-text">Cartes périmées</span>
                  {isActive('/cartes-perimee') && <FaChevronRight className="active-indicator" />}
                </Link>
              </li>
              <li className={isActive('/controleurs') ? 'active' : ''}>
                <Link to="/controleurs">
                  <FaIdBadge className="nav-icon" />
                  <span className="nav-text">ACT</span>
                  {isActive('/controleurs') && <FaChevronRight className="active-indicator" />}
                </Link>
              </li>
              <li className={isActive('/employees') ? 'active' : ''}>
                <Link to="/employees">
                  <FaUsers className="nav-icon" />
                  <span className="nav-text">Utilisateurs</span>
                  {isActive('/employees') && <FaChevronRight className="active-indicator" />}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{getUserInitials()}</div>
            <div className="user-details">
              <span className="username">{getDisplayName()}</span>
              <span className="user-role">{getFormattedRole()}</span>
            </div>
          </div>
          <Link to="/login" className="logout-button">
            <FaSignOutAlt />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
      
      {/* Main content area */}
      <div className={`main-wrapper ${sidebarOpen ? 'with-sidebar' : 'sidebar-closed'}`}>
        <main className="main-content">
          <Outlet />
        </main>
        <footer className="footer">
          <p>&copy; 2025 Zerrad Youssef</p>
        </footer>
      </div>
    </div>
  );
}

export default Layout;