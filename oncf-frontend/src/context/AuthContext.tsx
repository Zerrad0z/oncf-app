// src/context/AuthContext.tsx
import { createContext } from 'react';
import { AuthUser, Role } from '../types';

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  isAgentCom: () => boolean;
  isChefSect: () => boolean;
  isChefAnte: () => boolean;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;