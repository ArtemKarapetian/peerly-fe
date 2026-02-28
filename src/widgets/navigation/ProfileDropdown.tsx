import { useState, useRef, useEffect } from "react";
import { User, Settings, HelpCircle, Activity, LogOut } from "lucide-react";
import { useAuth } from "@/entities/user";

/**
 * ProfileDropdown - Dropdown menu для профиля пользователя
 *
 * Меню:
 * - Профиль
 * - Настройки
 * - Помощь
 * - Статус сервиса
 * - Выйти
 *
 * Режимы:
 * - collapsed: круглая кнопка-аватар с меню
 * - expanded: полная кнопка с текстом и меню
 */

interface ProfileDropdownProps {
  collapsed?: boolean;
  userName?: string;
}

export function ProfileDropdown({
  collapsed = false,
  userName = "Пользователь",
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const menuItems = [
    {
      icon: User,
      label: "Профиль",
      onClick: () => {
        window.location.hash = "/profile";
        setIsOpen(false);
      },
    },
    {
      icon: Settings,
      label: "Настройки",
      onClick: () => {
        window.location.hash = "/settings";
        setIsOpen(false);
      },
    },
    {
      icon: HelpCircle,
      label: "Помощь",
      onClick: () => {
        window.location.hash = "/help";
        setIsOpen(false);
      },
    },
    {
      icon: Activity,
      label: "Статус сервиса",
      onClick: () => {
        window.location.hash = "/status";
        setIsOpen(false);
      },
    },
  ];

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  // Collapsed mode - круглая кнопка-аватар
  if (collapsed) {
    return (
      <div ref={containerRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-[--brand-primary-lighter] flex items-center justify-center hover:bg-[--brand-primary-light] transition-colors focus:outline-none focus:ring-2 focus:ring-[--brand-primary] focus:ring-offset-2"
          aria-label="Меню профиля"
          aria-expanded={isOpen}
        >
          <User className="size-5 text-[--brand-primary]" />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute left-full ml-2 bottom-0 bg-[--surface] border border-[--surface-border] rounded-[var(--radius-md)] shadow-lg py-2 z-50 w-[200px]">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[--text-primary] hover:bg-[--surface-hover] transition-colors"
              >
                <item.icon className="size-4 text-[--text-secondary]" />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="border-t border-[--surface-border] my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[--text-primary] hover:bg-[--surface-hover] transition-colors"
            >
              <LogOut className="size-4 text-[--text-secondary]" />
              <span>Выйти</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Expanded mode - полная кнопка
  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[--surface-hover] rounded-[var(--radius-md)] transition-colors focus:outline-none focus:ring-2 focus:ring-[--brand-primary] focus:ring-offset-2"
        aria-label="Меню профиля"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-[--brand-primary-lighter] flex items-center justify-center shrink-0">
          <User className="size-4 text-[--brand-primary]" />
        </div>
        <span className="text-sm text-[--text-primary] truncate">{userName}</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 bg-[--surface] border border-[--surface-border] rounded-[var(--radius-md)] shadow-lg py-2 z-50 w-full min-w-[200px]">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[--text-primary] hover:bg-[--surface-hover] transition-colors"
            >
              <item.icon className="size-4 text-[--text-secondary]" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="border-t border-[--surface-border] my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[--text-primary] hover:bg-[--surface-hover] transition-colors"
          >
            <LogOut className="size-4 text-[--text-secondary]" />
            <span>Выйти</span>
          </button>
        </div>
      )}
    </div>
  );
}
