import { User, Settings, HelpCircle, Activity, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/entities/user";

// collapsed = круглая кнопка-аватар, expanded = с именем
interface ProfileDropdownProps {
  collapsed?: boolean;
  userName?: string;
}

export function ProfileDropdown({ collapsed = false, userName }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const displayName = userName || t("widget.profileDropdown.defaultUser");

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
      label: t("widget.profileDropdown.profile"),
      onClick: () => {
        void navigate("/profile");
        setIsOpen(false);
      },
    },
    {
      icon: Settings,
      label: t("widget.profileDropdown.settings"),
      onClick: () => {
        void navigate("/settings");
        setIsOpen(false);
      },
    },
    {
      icon: HelpCircle,
      label: t("widget.profileDropdown.help"),
      onClick: () => {
        void navigate("/help");
        setIsOpen(false);
      },
    },
    {
      icon: Activity,
      label: t("widget.profileDropdown.serviceStatus"),
      onClick: () => {
        void navigate("/status");
        setIsOpen(false);
      },
    },
  ];

  const handleLogout = () => {
    setIsOpen(false);
    void logout();
  };

  if (collapsed) {
    return (
      <div ref={containerRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-[--brand-primary-lighter] flex items-center justify-center hover:bg-[--brand-primary-light] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[--brand-primary] focus-visible:ring-offset-2"
          aria-label={t("widget.profileDropdown.profileMenu")}
          aria-expanded={isOpen}
        >
          <User className="size-5 text-[--brand-primary]" />
        </button>

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
              <span>{t("widget.profileDropdown.logout")}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[--surface-hover] rounded-[var(--radius-md)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[--brand-primary] focus-visible:ring-offset-2"
        aria-label={t("widget.profileDropdown.profileMenu")}
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-[--brand-primary-lighter] flex items-center justify-center shrink-0">
          <User className="size-4 text-[--brand-primary]" />
        </div>
        <span className="text-sm text-[--text-primary] truncate">{displayName}</span>
      </button>

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
            <span>{t("widget.profileDropdown.logout")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
