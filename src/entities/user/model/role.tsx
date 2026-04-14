import { createContext, useContext, useState, ReactNode } from "react";

/**
 * Role - Управление ролями пользователя для демо
 *
 * Roles:
 * - Student: студент (по умолчанию)
 * - Teacher: преподаватель
 * - Admin: администратор
 *
 * Сохраняется в localStorage как 'peerly_role'
 */

export type UserRole = "Student" | "Teacher" | "Admin";

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Role = createContext<RoleContextType | undefined>(undefined);

// Initialize role from localStorage
const getInitialRole = (): UserRole => {
  try {
    const savedRole = localStorage.getItem("peerly_role") as UserRole;
    if (savedRole && ["Student", "Teacher", "Admin"].includes(savedRole)) {
      return savedRole;
    }
  } catch (error) {
    console.error("Failed to load role from localStorage:", error);
  }
  return "Student";
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>(getInitialRole);

  // Save role to localStorage when it changes
  const setRole = (role: UserRole) => {
    try {
      localStorage.setItem("peerly_role", role);
      setCurrentRole(role);
    } catch (error) {
      console.error("Failed to save role to localStorage:", error);
      setCurrentRole(role); // Still update state even if localStorage fails
    }
  };

  return <Role.Provider value={{ currentRole, setRole }}>{children}</Role.Provider>;
}

export function useRole() {
  const context = useContext(Role);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

/**
 * Helper: Get role display name (i18n)
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleKeys: Record<UserRole, string> = {
    Student: "roles.student",
    Teacher: "roles.teacher",
    Admin: "roles.admin",
  };
  // Lazy import to avoid circular deps in context provider
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const i18n = require("@/shared/lib/i18n/config") as { default: { t: (key: string) => string } };
  return i18n.default.t(roleKeys[role]);
}

/**
 * Helper: Get role badge color
 */
export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case "Student":
      return "bg-info-light text-brand-primary";
    case "Teacher":
      return "bg-warning-light text-warning";
    case "Admin":
      return "bg-secondary text-foreground";
  }
}
