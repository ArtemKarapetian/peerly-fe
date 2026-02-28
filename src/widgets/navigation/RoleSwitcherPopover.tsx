import { useState, useRef, useEffect } from "react";
import { useRole, getRoleDisplayName } from "@/entities/user";
import type { UserRole } from "@/entities/user";

/**
 * RoleSwitcherPopover - Flexible role switcher component
 *
 * Collapsed mode:
 * - Click to open/close
 * - Click outside to close
 * - Escape key to close
 * - Stays open while hovering over menu
 *
 * Expanded mode:
 * - Show full role list with buttons
 */

interface RoleSwitcherPopoverProps {
  collapsed?: boolean;
}

export function RoleSwitcherPopover({ collapsed = true }: RoleSwitcherPopoverProps) {
  const { currentRole, setRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const roles: UserRole[] = ["Student", "Teacher", "Admin"];

  // Handle click outside
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

  // Handle Escape key
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

  // Expanded mode
  if (!collapsed) {
    return (
      <div className="px-3 pb-2">
        <p className="text-[11px] text-[#767692] font-medium uppercase tracking-wide px-3 mb-2">
          Демо: Роль
        </p>
        <div className="space-y-1">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleSelectRole(role)}
              className={`
                w-full text-left px-3 py-2 rounded-[8px] text-[14px] transition-colors flex items-center justify-between
                ${role === currentRole ? "bg-[#e9f5ff] text-[#3d6bc6] font-medium" : "text-[#21214f] hover:bg-[#f9f9f9]"}
              `}
            >
              <span>{getRoleDisplayName(role)}</span>
              {role === currentRole && <div className="w-2 h-2 rounded-full bg-[#3d6bc6]"></div>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Collapsed mode with click-to-toggle popover
  return (
    <div ref={containerRef} className="relative px-3 pb-2">
      <div className="flex justify-center">
        <button
          onClick={handleToggle}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5b8def] to-[#3d6bc6] flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#5b8def] focus:ring-offset-2"
          title={`Роль: ${getRoleDisplayName(currentRole)}`}
          aria-label="Переключить роль"
          aria-expanded={isOpen}
        >
          <span className="text-white text-[11px] font-bold">{currentRole[0]}</span>
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-full ml-2 top-0 bg-white border-2 border-[#e6e8ee] rounded-[12px] shadow-lg py-2 z-50 w-[180px]">
          <p className="px-3 py-1 text-[11px] text-[#767692] font-medium uppercase tracking-wide">
            Переключить роль
          </p>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleSelectRole(role)}
              className={`
                w-full text-left px-3 py-2 text-[14px] transition-colors
                ${role === currentRole ? "bg-[#e9f5ff] text-[#3d6bc6] font-medium" : "text-[#21214f] hover:bg-[#f9f9f9]"}
              `}
            >
              {getRoleDisplayName(role)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
