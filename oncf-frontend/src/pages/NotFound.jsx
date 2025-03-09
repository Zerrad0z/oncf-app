import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page non trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <Link to="/" className="back-link">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;