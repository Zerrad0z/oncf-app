import { useAuth } from '../hooks/useAuth';

function SidebarUserInfo() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="sidebar-user-info">
      <div className="user-details">
        <div className="user-name">{user.nom} {user.prenom}</div>
        <div className="user-role">{formatRole(user.role)}</div>
      </div>
      <button onClick={logout} className="logout-button">
        Déconnexion
      </button>
    </div>
  );
}

// Helper function to format role for display
function formatRole(role) {
  if (!role) return '';
  
  // Remove prefix if exists
  let displayRole = role.replace('ROLE_', '');
  
  // Replace underscores with spaces
  displayRole = displayRole.replace(/_/g, ' ');
  
  // Capitalize each word
  return displayRole
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default SidebarUserInfo;