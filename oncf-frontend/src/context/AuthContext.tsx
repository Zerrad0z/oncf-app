// src/context/AuthContext.tsx
import { createContext } from 'react';
import { AuthUser, Role } from '../types';

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: AuthUser) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  isAgentCom: () => boolean;
  isChefSect: () => boolean;
  isChefAnte: () => boolean;
}

const defaultValue: AuthContextType = {
  user: null,
  loading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
  isAgentCom: () => false,
  isChefSect: () => false,
  isChefAnte: () => false,
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export default AuthContext;