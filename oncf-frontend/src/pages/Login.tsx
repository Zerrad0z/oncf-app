import React, { useState, useContext } from 'react';
import authService from '../services/authService';
import AuthContext from '../context/AuthContext';
import './Login.css'; // Import the CSS file

import companyLogo from '../assets/logo.jpg'; 

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await authService.login(formData);
      login(userData);
      window.location.href = '/'; // Redirect to dashboard on successful login
    } catch (err: any) {
      if (err.response) {
        // Handle specific error responses
        switch (err.response.status) {
          case 401:
            setError('Invalid username or password');
            break;
          case 403:
            setError('Account is locked or your session has expired');
            break;
          default:
            setError(`Login failed: ${err.response.data?.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please try again later.');
      } else {
        // Something else happened while setting up the request
        setError(`Error: ${err.message}`);
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={companyLogo} alt="Company Logo" className="company-logo" />
      
      <h2>Welcome Back</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>
          Don't have an account? <a href="/register" style={{ color: '#4a90e2', textDecoration: 'none' }}>Create account</a>
        </p>
      </form>
    </div>
  );
};

export default Login;