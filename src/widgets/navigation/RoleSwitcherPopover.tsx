import { useState, useRef, useEffect } from "react";

import { useRole, getRoleDisplayName } from "@/entities/user";
import type { UserRole } from "@/entities/user";

interface RoleSwitcherPopoverProps {
  collapsed?: boolean;
}

export function RoleSwitcherPopover({ collapsed = true }: RoleSwitcherPopoverProps) {
  const { currentRole, setRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const roles: UserRole[] = ["Student", "Teacher", "Admin"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && collapsed) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, collapsed]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen && collapsed) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, collapsed]);

  const handleToggle = () => {
    if (collapsed) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setRole(role);
    if (collapsed) {
      setIsOpen(false);
    }
  };

  // Expanded mode — inline list
  if (!collapsed) {
    return (
      <div className="px-2.5 pb-2">
        <p className="text-[10px] text-[--text-tertiary] font-medium uppercase tracking-wider px-2.5 mb-1.5">
          Демо: Роль
        </p>
        <div className="space-y-0.5">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleSelectRole(role)}
              className={`w-full text-left px-2.5 py-[6px] rounded-[6px] text-[13px] transition-colors flex items-center justify-between ${
                role === currentRole
                  ? "bg-[#eef4ff] text-[--brand-primary] font-medium"
                  : "text-[--text-secondary] hover:bg-[--surface-hover] hover:text-[--text-primary]"
              }`}
            >
              <span>{getRoleDisplayName(role)}</span>
              {role === currentRole && (
                <div className="w-1.5 h-1.5 rounded-full bg-[--brand-primary]" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Collapsed mode — circle button + popover
  return (
    <div ref={containerRef} className="relative px-2.5 pb-2">
      <div className="flex justify-center">
        <button
          onClick={handleToggle}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5b8def] to-[#3d6bc6] flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[--brand-primary] focus:ring-offset-2"
          title={`Роль: ${getRoleDisplayName(currentRole)}`}
          aria-label="Переключить роль"
          aria-expanded={isOpen}
        >
          <span className="text-white text-[10px] font-bold">{currentRole[0]}</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-full ml-2 top-0 bg-white border border-[--surface-border] rounded-[8px] shadow-[var(--shadow-lg)] py-1 z-50 w-[170px]">
          <p className="px-3 py-1 text-[10px] text-[--text-tertiary] font-medium uppercase tracking-wider">
            Переключить роль
          </p>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleSelectRole(role)}
              className={`w-full text-left px-3 py-[6px] text-[13px] transition-colors ${
                role === currentRole
                  ? "bg-[#eef4ff] text-[--brand-primary] font-medium"
                  : "text-[--text-primary] hover:bg-[--surface-hover]"
              }`}
            >
              {getRoleDisplayName(role)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
