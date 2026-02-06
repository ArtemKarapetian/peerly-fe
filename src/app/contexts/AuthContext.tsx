import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * AuthContext - Простой контекст авторизации (мок)
 * Управляет состоянием isAuthenticated через localStorage
 */

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Проверяем localStorage при инициализации
    return localStorage.getItem('peerly_auth') === 'true';
  });

  // Синхронизируем с localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('peerly_auth', 'true');
    } else {
      localStorage.removeItem('peerly_auth');
    }
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Редирект на landing после logout
    window.location.hash = '/';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
