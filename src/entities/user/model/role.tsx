import { createContext, useContext, useState, ReactNode } from "react";

// Управление демо-ролью; роль сохраняется в localStorage под ключом peerly_role

export type UserRole = "Student" | "Teacher" | "Admin";

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Role = createContext<RoleContextType | undefined>(undefined);

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

  const setRole = (role: UserRole) => {
    try {
      localStorage.setItem("peerly_role", role);
    } catch (error) {
      console.error("Failed to save role to localStorage:", error);
    }
    setCurrentRole(role);
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

export function getRoleDisplayName(role: UserRole): string {
  const roleKeys: Record<UserRole, string> = {
    Student: "roles.student",
    Teacher: "roles.teacher",
    Admin: "roles.admin",
  };
  // require, чтобы избежать циклического импорта context-провайдера
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const i18n = require("@/shared/lib/i18n/config") as { default: { t: (key: string) => string } };
  return i18n.default.t(roleKeys[role]);
}

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
