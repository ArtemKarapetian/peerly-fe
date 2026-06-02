import type { Role } from "@/shared/api";

import { useAuth } from "./auth";

export type UserRole = Role;

export function useRole(): { currentRole: UserRole | null } {
  const { session } = useAuth();
  return {
    currentRole: session?.role ?? null,
  };
}
