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
  register: (input: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }) => Promise<{ userId: string }>;
  confirmEmail: (input: { token: string; userId: string }) => Promise<Session>;
  logout: () => Promise<void>;
  /** Re-fetch profile from /me and merge into session. */
  refreshMe: () => Promise<void>;
  /** Update name via PUT /me, then refresh session. */
  updateMyName: (name: string) => Promise<void>;
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
    const me = await authApi.getMe(role).catch(() => null);
    const next: Session = {
      userId: me?.userId || String(res.userId),
      userName: me?.name ?? "",
      email: me?.email || email,
      role,
    };
    setSession(next);
    setSessionState(next);
    return next;
  }, []);

  const register = useCallback<AuthContextType["register"]>(
    async ({ email, password, name, role }) => {
      const res = await authApi.register({ email, password, name, role });
      return { userId: String(res.userId) };
    },
    [],
  );

  const confirmEmail = useCallback<AuthContextType["confirmEmail"]>(async ({ token, userId }) => {
    const res = await authApi.confirmEmail({ token, userId });
    const { role } = await authApi.getMyRole();
    const me = await authApi.getMe(role).catch(() => null);
    const next: Session = {
      userId: me?.userId || String(res.userId),
      userName: me?.name ?? "",
      email: me?.email ?? "",
      role,
    };
    setSession(next);
    setSessionState(next);
    return next;
  }, []);

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

  const refreshMe = useCallback<AuthContextType["refreshMe"]>(async () => {
    const current = getSession();
    if (!current) return;
    const me = await authApi.getMe(current.role).catch(() => null);
    if (!me) return;
    const next: Session = {
      userId: me.userId || current.userId,
      userName: me.name,
      email: me.email || current.email,
      role: current.role,
    };
    setSession(next);
    setSessionState(next);
  }, []);

  const updateMyName = useCallback<AuthContextType["updateMyName"]>(async (name) => {
    const current = getSession();
    if (!current) throw new Error("Not authenticated");
    await authApi.updateMyName(current.role, name);
    const next: Session = { ...current, userName: name };
    setSession(next);
    setSessionState(next);
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
        confirmEmail,
        logout,
        refreshMe,
        updateMyName,
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
