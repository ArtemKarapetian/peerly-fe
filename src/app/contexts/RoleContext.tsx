import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * RoleContext - Управление ролями пользователя для демо
 * 
 * Roles:
 * - Student: студент (по умолчанию)
 * - Teacher: преподаватель
 * - Admin: администратор
 * 
 * Сохраняется в localStorage как 'peerly_role'
 */

export type UserRole = 'Student' | 'Teacher' | 'Admin';

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('Student');

  // Load role from localStorage on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('peerly_role') as UserRole;
      if (savedRole && ['Student', 'Teacher', 'Admin'].includes(savedRole)) {
        setCurrentRole(savedRole);
      }
    } catch (error) {
      console.error('Failed to load role from localStorage:', error);
    }
  }, []);

  // Save role to localStorage when it changes
  const setRole = (role: UserRole) => {
    try {
      localStorage.setItem('peerly_role', role);
      setCurrentRole(role);
    } catch (error) {
      console.error('Failed to save role to localStorage:', error);
      setCurrentRole(role); // Still update state even if localStorage fails
    }
  };

  return (
    <RoleContext.Provider value={{ currentRole, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

/**
 * Helper: Get role display name in Russian
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'Student':
      return 'Студент';
    case 'Teacher':
      return 'Преподаватель';
    case 'Admin':
      return 'Администратор';
  }
}

/**
 * Helper: Get role badge color
 */
export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case 'Student':
      return 'bg-[#e9f5ff] text-[#5b8def]';
    case 'Teacher':
      return 'bg-[#fff8e1] text-[#f57c00]';
    case 'Admin':
      return 'bg-[#f3e5f5] text-[#8e24aa]';
  }
}
