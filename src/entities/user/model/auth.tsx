import { createContext, useContext, useState, ReactNode, useCallback } from "react";

import { clearSession, getSession, setSession, type Role, type Session } from "@/shared/api";
import { appNavigate } from "@/shared/lib/navigate";

import { authApi } from "../api/authHttp";

interface AuthContextType {
  isAuthenticated: boolean;
  session: Session | null;
  /** Kept for backwards compatibility with UI that reads `user`. */
  user: { id: string; name: string; email: string } | null;
  login: (input: { email: string; password: string }) => Promise<Session>;
  register: (input: { email: string; password: string; name: string; role: Role }) => Promise<void>;
  logout: () => Promise<void>;
  /** Dev-only role swap; backend still enforces JWT claims. */
  switchRoleDev: (role: Role) => void;
}

const Auth = createContext<AuthContextType | undefined>(undefined);

function sessionToUser(s: Session | null) {
  return s ? { id: s.userId, name: s.userName, email: s.email } : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() => getSession());

  const login = useCallback<AuthContextType["login"]>(async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const { role } = await authApi.getMyRole();
    const userName = await authApi.lookupMyName(email, role).catch(() => "");
    const next: Session = {
      userId: String(res.userId),
      userName,
      email,
      role,
    };
    setSession(next);
    setSessionState(next);
    return next;
  }, []);

  const register = useCallback<AuthContextType["register"]>(
    async ({ email, password, name, role }) => {
      const res = await authApi.register({ email, password, name, role });
      const next: Session = {
        userId: String(res.userId),
        userName: name,
        email,
        role,
      };
      setSession(next);
      setSessionState(next);
    },
    [],
  );

  const switchRoleDev = useCallback<AuthContextType["switchRoleDev"]>((role) => {
    setSessionState((prev) => {
      const base = prev ?? {
        userId: "dev-1",
        userName: "Dev",
        email: "dev@local",
        role,
      };
      const next: Session = { ...base, role };
      setSession(next);
      return next;
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // noop
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
        switchRoleDev,
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
