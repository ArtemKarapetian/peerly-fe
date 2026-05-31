import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  ApiError,
  clearSession,
  getSession,
  setSession,
  type Role,
  type Session,
} from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";
import { logger } from "@/shared/lib/logger";
import { appNavigate } from "@/shared/lib/navigate";

import { authApi } from "../api/authHttp";

export type AuthStatus = "unknown" | "anonymous" | "authenticated";

interface AuthContextType {
  status: AuthStatus;
  isAuthenticated: boolean;
  session: Session | null;
  user: { id: string; name: string; email: string } | null;
  login: (input: { email: string; password: string }) => Promise<Session>;
  register: (input: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }) => Promise<{ userId: string }>;
  confirmEmail: (input: { token: string }) => Promise<Session>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  updateMyName: (name: string) => Promise<void>;
  switchRoleDev: (role: Role) => void;
}

const Auth = createContext<AuthContextType | undefined>(undefined);

function sessionToUser(s: Session | null) {
  return s ? { id: s.userId, name: s.userName, email: s.email } : null;
}

function isFatalAuthError(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 401 || err.status === 403);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() => getSession());
  const [status, setStatus] = useState<AuthStatus>(() => (getSession() ? "unknown" : "anonymous"));
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    const initialSession = getSession();
    if (!initialSession) return;
    bootstrappedRef.current = true;

    void (async () => {
      try {
        const { role } = await authApi.getMyRole();
        const me = await authApi.getMe(role).catch((err) => {
          logger.warn("getMe failed during session bootstrap", err);
          return null;
        });
        const next: Session = {
          userId: me?.userId || initialSession.userId,
          userName: me?.name ?? initialSession.userName,
          email: me?.email || initialSession.email,
          role,
        };
        setSession(next);
        setSessionState(next);
        setStatus("authenticated");
      } catch (err) {
        if (isFatalAuthError(err)) {
          clearSession();
          setSessionState(null);
          setStatus("anonymous");
        } else {
          logger.warn("session bootstrap failed (non-fatal)", err);
          setStatus("authenticated");
        }
      }
    })();
  }, []);

  const login = useCallback<AuthContextType["login"]>(async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const { role } = await authApi.getMyRole();
    const me = await authApi.getMe(role).catch((err) => {
      logger.warn("getMe failed", err);
      return null;
    });
    const next: Session = {
      userId: me?.userId || String(res.userId),
      userName: me?.name ?? "",
      email: me?.email || email,
      role,
    };
    setSession(next);
    setSessionState(next);
    setStatus("authenticated");
    return next;
  }, []);

  const register = useCallback<AuthContextType["register"]>(
    async ({ email, password, name, role }) => {
      const res = await authApi.register({ email, password, name, role });
      return { userId: String(res.userId) };
    },
    [],
  );

  const confirmEmail = useCallback<AuthContextType["confirmEmail"]>(async ({ token }) => {
    const res = await authApi.confirmEmail({ token });
    const { role } = await authApi.getMyRole();
    const me = await authApi.getMe(role).catch((err) => {
      logger.warn("getMe failed", err);
      return null;
    });
    const next: Session = {
      userId: me?.userId || String(res.userId),
      userName: me?.name ?? "",
      email: me?.email ?? "",
      role,
    };
    setSession(next);
    setSessionState(next);
    setStatus("authenticated");
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
    setStatus("authenticated");
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
    setStatus("anonymous");
    appNavigate(ROUTES.landing);
  }, []);

  return (
    <Auth.Provider
      value={{
        status,
        isAuthenticated: status === "authenticated",
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
