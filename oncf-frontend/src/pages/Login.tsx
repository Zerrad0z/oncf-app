// src/pages/Login.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { AuthUser } from '../types';

// If you're using Material UI, you can replace this with MUI components
const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Veuillez saisir un nom d\'utilisateur et un mot de passe.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Call the login API
      const response = await authService.login({ username, password });
      
      // Extract data from the AuthResponseDTO
      const { token, id, username: uname, role } = response;
      
      // Create the user object that matches your AuthUser interface
      const userData: AuthUser = { 
        id, 
        username: uname, 
        role,
        token
      };
      
      // Login using the auth hook
      login(userData);
      
      // Redirect to the original destination or home
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response && err.response.status === 401) {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
      } else {
        setError('Erreur lors de la connexion. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>ONCF Report System</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;