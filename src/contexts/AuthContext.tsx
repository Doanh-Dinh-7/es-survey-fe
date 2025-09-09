import React, { createContext, useState, useContext, ReactNode } from 'react';
import { getStoredAuth } from '../services/auth';

interface AuthState {
  token: string | null;
}

interface AuthContextType extends AuthState {
  returnUrl?: string;
  login: (token: string, returnUrl: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);
export { AuthContext };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedAuth = getStoredAuth();
  const [token, setToken] = useState<string | null>(storedAuth?.token || null);
  const [returnUrl, setReturnUrl] = useState<string | undefined>(undefined);

  const login = (authToken: string, returnUrl: string): void => {
    setToken(authToken);
    localStorage.setItem('token', authToken);
    setReturnUrl(returnUrl);
  };

  const logout = (): void => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  const value: AuthContextType = {
    token,
    returnUrl,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};