import { createContext, useContext, useState, ReactNode, useCallback } from "react";

import { clearSession, getSession, setSession, type Role, type Session } from "@/shared/api";
import { env } from "@/shared/config/env";
import { appNavigate } from "@/shared/lib/navigate";

import { authApi } from "../api/authHttp";

interface AuthContextType {
  isAuthenticated: boolean;
  session: Session | null;
  /** Kept for backwards compatibility with UI that reads `user`. */
  user: { id: string; name: string; email: string } | null;
  login: (input: {
    email: string;
    password: string;
    role: Role;
    userName?: string;
  }) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    userName: string;
    role: Role;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const Auth = createContext<AuthContextType | undefined>(undefined);

function sessionToUser(s: Session | null) {
  return s ? { id: s.userId, name: s.userName, email: s.email } : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() => getSession());

  const login = useCallback<AuthContextType["login"]>(
    async ({ email, password, role, userName }) => {
      if (!env.apiUrl) {
        // Demo mode: bypass BE, build a local session.
        const next: Session = {
          userId: "demo-1",
          userName: userName?.trim() || email.split("@")[0],
          email,
          role,
        };
        setSession(next);
        setSessionState(next);
        return;
      }

      const res = await authApi.login({ email, password });
      const next: Session = {
        userId: String(res.userId),
        userName: userName?.trim() || email.split("@")[0],
        email,
        role,
      };
      setSession(next);
      setSessionState(next);
    },
    [],
  );

  const register = useCallback<AuthContextType["register"]>(
    async ({ email, password, userName, role }) => {
      if (!env.apiUrl) {
        const next: Session = { userId: "demo-1", userName, email, role };
        setSession(next);
        setSessionState(next);
        return;
      }

      const res = await authApi.register({ email, password, userName, role });
      const next: Session = {
        userId: String(res.userId),
        userName,
        email,
        role,
      };
      setSession(next);
      setSessionState(next);
    },
    [],
  );

  const logout = useCallback(async () => {
    if (env.apiUrl) {
      try {
        await authApi.logout();
      } catch {
        // If the server session is already gone, the cookies are cleared
        // anyway — proceed to local cleanup.
      }
    }
    clearSession();
    setSessionState(null);
    appNavigate("/");
  }, []);

  return (
    <Auth.Provider
      value={{
        isAuthenticated: session !== null,
        session,
        user: sessionToUser(session),
        login,
        register,
        logout,
      }}
    >
      {children}
    </Auth.Provider>
  );
}

export function useAuth() {
  const context = useContext(Auth);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
