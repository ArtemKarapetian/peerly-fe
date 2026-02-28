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
 * Helper: Get role display name in Russian
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "Student":
      return "Студент";
    case "Teacher":
      return "Преподаватель";
    case "Admin":
      return "Администратор";
  }
}

/**
 * Helper: Get role badge color
 */
export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case "Student":
      return "bg-[#e9f5ff] text-[#5b8def]";
    case "Teacher":
      return "bg-[#fff8e1] text-[#f57c00]";
    case "Admin":
      return "bg-[#f3e5f5] text-[#8e24aa]";
  }
}
