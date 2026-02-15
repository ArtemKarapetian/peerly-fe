import {
  Book,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileCheck,
  MessageSquare,
  BookOpen,
  Bell,
  Users,
  Layers,
  BarChart3,
  Settings,
  Database,
  Plug,
  Flag,
  FileSearch,
  Zap,
} from "lucide-react";
import { useRole } from "@/app/providers/role.tsx";
import { RoleSwitcherPopover } from "./RoleSwitcherPopover";

/**
 * SideNav - Role-Aware Navigation
 *
 * Показывает разные элементы меню в зависимости от роли:
 * - Student: Dashboard, Courses, Reviews, etc.
 * - Teacher: Teaching Dashboard, Course Management, Rubrics, etc.
 * - Admin: System Overview, Users, Integrations, etc.
 */

type SideNavVariant =
  | "desktop-expanded"
  | "desktop-collapsed"
  | "tablet-collapsed"
  | "tablet-expanded"
  | "mobile-drawer";

interface SideNavProps {
  variant: SideNavVariant;
  isOpen?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  hash: string;
}

export function SideNav({ variant, isOpen = false, onClose, onToggleCollapse }: SideNavProps) {
  const { currentRole } = useRole();
  const isCollapsed = variant === "desktop-collapsed" || variant === "tablet-collapsed";
  const isMobileDrawer = variant === "mobile-drawer";
  // Show toggle button on desktop AND tablet
  const showToggleButton =
    variant === "desktop-expanded" ||
    variant === "desktop-collapsed" ||
    variant === "tablet-collapsed" ||
    variant === "tablet-expanded";

  // Navigation items by role
  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case "Student":
        return [
          { icon: LayoutDashboard, label: "Дашборд", hash: "/dashboard" },
          { icon: Book, label: "Курсы", hash: "/courses" },
          { icon: FileCheck, label: "Рецензии", hash: "/reviews" },
          { icon: MessageSquare, label: "Полученные отзывы", hash: "/reviews/received" },
          { icon: BookOpen, label: "Журнал оценок", hash: "/gradebook" },
          { icon: Bell, label: "Уведомления", hash: "/inbox" },
        ];
      case "Teacher":
        return [
          { icon: LayoutDashboard, label: "Дашборд", hash: "/teacher/dashboard" },
          { icon: Book, label: "Курсы", hash: "/teacher/courses" },
          { icon: Layers, label: "Библиотека рубрик", hash: "/teacher/rubrics" },
          { icon: FileCheck, label: "Работы студентов", hash: "/teacher/submissions" },
          { icon: BarChart3, label: "Аналитика", hash: "/teacher/analytics" },
        ];
      case "Admin":
        return [
          { icon: LayoutDashboard, label: "Обзор системы", hash: "/admin/overview" },
          { icon: Book, label: "Все курсы", hash: "/admin/courses" },
          { icon: Users, label: "Пользователи", hash: "/admin/users" },
          { icon: Database, label: "Организации", hash: "/admin/orgs" },
          { icon: Plug, label: "Каталог плагинов", hash: "/admin/plugins" },
          { icon: Zap, label: "Интеграции", hash: "/admin/integrations" },
          { icon: Settings, label: "Настройки системы", hash: "/admin/settings" },
          { icon: Flag, label: "Фиче-флаги", hash: "/admin/flags" },
          { icon: FileSearch, label: "Логи и аудит", hash: "/admin/logs" },
        ];
    }
  };

  const navItems = getNavItems();

  // Mobile Drawer
  if (isMobileDrawer) {
    return (
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bg-white transform transition-transform duration-300 w-[280px]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.1)" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-[64px] px-4 border-b-2 border-[#c7c7c7] shrink-0">
            <a
              href="#/dashboard"
              className="text-[20px] font-medium text-[#21214f] tracking-[-0.9px] hover:opacity-70 transition-opacity cursor-pointer"
            >
              Peerly
            </a>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Закрыть меню"
            >
              <X className="size-5 text-[#21214f]" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.hash}
                  className="bg-[#d2def8] rounded-[8px] px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#c5d5f5] transition-colors"
                  onClick={() => {
                    window.location.hash = item.hash;
                    onClose?.();
                  }}
                >
                  <Icon className="size-[19px] text-[#21214f]" />
                  <span className="text-[18px] text-[#21214f] tracking-[-0.54px]">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Role Switcher */}
          <div className="border-t-2 border-[#c7c7c7] pt-3 shrink-0">
            <RoleSwitcherPopover collapsed={false} />
          </div>

          {/* Profile & Settings */}
          <div className="border-t-2 border-[#c7c7c7] shrink-0 pb-4">
            <div className="px-3 py-3 space-y-2">
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                onClick={() => {
                  window.location.hash = "/profile";
                  onClose?.();
                }}
              >
                <User className="size-[19px] text-[#d7d7d7]" />
                <span className="text-[18px] text-foreground tracking-[-0.54px]">Профиль</span>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                onClick={() => {
                  window.location.hash = "/settings";
                  onClose?.();
                }}
              >
                <Settings className="size-[19px] text-[#d7d7d7]" />
                <span className="text-[18px] text-foreground tracking-[-0.54px]">Настройки</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop/Tablet Sidebar
  return (
    <div
      className={`
        bg-white border-r-3 border-[#c7c7c7] h-screen flex flex-col shrink-0 transition-all duration-300
        ${isCollapsed ? "w-[80px]" : "w-[260px]"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-[64px] px-4 border-b-2 border-[#c7c7c7] shrink-0">
        {!isCollapsed && (
          <a
            href="#/dashboard"
            className="text-[20px] font-medium text-[#21214f] tracking-[-0.9px] hover:opacity-70 transition-opacity cursor-pointer"
          >
            Peerly
          </a>
        )}
        {showToggleButton && (
          <button
            onClick={onToggleCollapse}
            className={`p-1 hover:bg-gray-100 rounded transition-colors ${isCollapsed ? "mx-auto" : ""}`}
            aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
          >
            {isCollapsed ? (
              <ChevronRight className="size-5 text-[#21214f]" />
            ) : (
              <ChevronLeft className="size-5 text-[#21214f]" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.hash}
              className={`
                bg-[#d2def8] rounded-[8px] flex items-center gap-2 cursor-pointer 
                hover:bg-[#c5d5f5] transition-colors py-2
                ${isCollapsed ? "justify-center px-2" : "px-3"}
              `}
              onClick={() => (window.location.hash = item.hash)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="size-[19px] text-[#21214f] shrink-0" />
              {!isCollapsed && (
                <span className="text-[18px] text-[#21214f] tracking-[-0.54px]">{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0">
        {/* Role Switcher */}
        <div className="border-t-2 border-[#c7c7c7] pt-3">
          <RoleSwitcherPopover collapsed={isCollapsed} />
        </div>

        {/* Profile & Settings */}
        <div className="border-t-2 border-[#c7c7c7] pb-4">
          <div className="px-3 py-3 space-y-2">
            <div
              className={`
                flex items-center gap-2 hover:bg-gray-50 rounded cursor-pointer transition-colors py-2
                ${isCollapsed ? "justify-center px-2" : "px-3"}
              `}
              onClick={() => (window.location.hash = "/profile")}
              title={isCollapsed ? "Профиль" : undefined}
            >
              <User className="size-[19px] text-[#d7d7d7] shrink-0" />
              {!isCollapsed && (
                <span className="text-[18px] text-foreground tracking-[-0.54px]">Профиль</span>
              )}
            </div>
            <div
              className={`
                flex items-center gap-2 hover:bg-gray-50 rounded cursor-pointer transition-colors py-2
                ${isCollapsed ? "justify-center px-2" : "px-3"}
              `}
              onClick={() => (window.location.hash = "/settings")}
              title={isCollapsed ? "Настройки" : undefined}
            >
              <Settings className="size-[19px] text-[#d7d7d7] shrink-0" />
              {!isCollapsed && (
                <span className="text-[18px] text-foreground tracking-[-0.54px]">Настройки</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
