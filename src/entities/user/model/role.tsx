import type { Role } from "@/shared/api";

import { useAuth } from "./auth";

export type UserRole = Role;

export function useRole(): { currentRole: UserRole | null; setRole: (role: UserRole) => void } {
  const { session, switchRoleDev } = useAuth();
  return {
    currentRole: session?.role ?? null,
    setRole: switchRoleDev,
  };
}
