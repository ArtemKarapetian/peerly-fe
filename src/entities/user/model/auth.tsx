import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { clearTokens, setTokens } from "@/shared/api/httpClient";
import { appNavigate } from "@/shared/lib/navigate";

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data?: LoginResponse) => void;
  logout: () => void;
}

const Auth = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("peerly_auth") === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("peerly_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("peerly_auth", String(isAuthenticated));
    if (user) {
      localStorage.setItem("peerly_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("peerly_user");
    }
  }, [isAuthenticated, user]);

  const login = (data?: LoginResponse) => {
    const defaultUser: User = { id: "student-1", name: "Студент", email: "student@example.com" };
    setUser(data?.user ?? defaultUser);
    setIsAuthenticated(true);

    if (data?.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    clearTokens();
    appNavigate("/");
  };

  return <Auth.Provider value={{ isAuthenticated, user, login, logout }}>{children}</Auth.Provider>;
}

export function useAuth() {
  const context = useContext(Auth);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
