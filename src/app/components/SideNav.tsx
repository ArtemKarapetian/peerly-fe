import {
  Book,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileCheck,
  MessageSquare,
  BookOpen,
  Bell,
} from "lucide-react";
import { ProfileDropdown } from "../../widgets/navigation/ProfileDropdown.tsx";

/**
 * SideNav - Навигационная панель с вариантами для разных брейкпоинтов
 *
 * Варианты:
 * - desktop-expanded: 260px, полный текст
 * - desktop-collapsed: 80px, только иконки
 * - tablet-collapsed: 80px, только иконки
 * - mobile-drawer: 280px overlay drawer
 *
 * Навигация:
 * - Дашборд (home)
 * - Курсы (courses list)
 *
 * Структура (vertical layout):
 * ┌────────────────┐
 * │ Header (64px)  │ ← Логотип + toggle
 * ├────────────────┤
 * │ Navigation     │ ← Меню (flex-1)
 * │  • Дашборд     │
 * │  • Курсы       │
 * │                │
 * ├────────────────┤
 * │ Profile        │ ← Профиль (внизу)
 * └────────────────┘
 */

type SideNavVariant =
  | "desktop-expanded"
  | "desktop-collapsed"
  | "tablet-collapsed"
  | "mobile-drawer";

interface SideNavProps {
  variant: SideNavVariant;
  isOpen?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export function SideNav({ variant, isOpen = false, onClose, onToggleCollapse }: SideNavProps) {
  const isCollapsed = variant === "desktop-collapsed" || variant === "tablet-collapsed";
  const isMobileDrawer = variant === "mobile-drawer";
  const showToggleButton =
    variant === "desktop-expanded" ||
    variant === "desktop-collapsed" ||
    variant === "tablet-collapsed";

  // Mobile Drawer - overlay
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
            <p className="text-[20px] font-['Work_Sans:Medium',sans-serif] font-medium text-[#21214f] tracking-[-0.9px]">
              Peerly
            </p>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Закрыть меню"
            >
              <X className="size-5 text-[#21214f]" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-4 px-3 space-y-2">
            <div
              className="bg-[#d2def8] rounded-[8px] px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#c5d5f5] transition-colors"
              onClick={() => {
                window.location.hash = "/dashboard";
                onClose?.();
              }}
            >
              <LayoutDashboard className="size-[19px] text-[#21214f]" />
              <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
                Дашборд
              </span>
            </div>
            <div
              className="bg-[#d2def8] rounded-[8px] px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#c5d5f5] transition-colors"
              onClick={() => {
                window.location.hash = "/courses";
                onClose?.();
              }}
            >
              <Book className="size-[19px] text-[#21214f]" />
              <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
                Курсы
              </span>
            </div>
            <div
              className="bg-[#d2def8] rounded-[8px] px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#c5d5f5] transition-colors"
              onClick={() => {
                window.location.hash = "/reviews";
                onClose?.();
              }}
            >
              <FileCheck className="size-[19px] text-[#21214f]" />
              <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
                Рецензии
              </span>
            </div>
            <div
              className="bg-[#d2def8] rounded-[8px] px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#c5d5f5] transition-colors"
              onClick={() => {
                window.location.hash = "/reviews/received";
                onClose?.();
              }}
            >
              <MessageSquare className="size-[19px] text-[#21214f]" />
              <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
                Полученные отзывы
              </span>
            </div>
            <div
              className="bg-[#d2def8] rounded-[8px] px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#c5d5f5] transition-colors"
              onClick={() => {
                window.location.hash = "/gradebook";
                onClose?.();
              }}
            >
              <BookOpen className="size-[19px] text-[#21214f]" />
              <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
                Журнал оценок
              </span>
            </div>
            <div
              className="bg-[#d2def8] rounded-[8px] px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#c5d5f5] transition-colors"
              onClick={() => {
                window.location.hash = "/inbox";
                onClose?.();
              }}
            >
              <Bell className="size-[19px] text-[#21214f]" />
              <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
                Уведомления
              </span>
            </div>
          </div>

          {/* Profile - Bottom */}
          <div className="h-[72px] border-t-2 border-[#c7c7c7] flex items-center px-3 shrink-0">
            <ProfileDropdown userName="Студент" />
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
      {/* Header - Фиксированная высота 64px */}
      <div className="flex items-center justify-between h-[64px] px-4 border-b-2 border-[#c7c7c7] shrink-0">
        {!isCollapsed && (
          <p className="text-[20px] font-['Work_Sans:Medium',sans-serif] font-medium text-[#21214f] tracking-[-0.9px]">
            Peerly
          </p>
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

      {/* Navigation Items - Flex-1 заполняет пространство между header и footer */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-2">
        <div
          className={`
            bg-[#d2def8] rounded-[8px] flex items-center gap-2 cursor-pointer 
            hover:bg-[#c5d5f5] transition-colors py-2
            ${isCollapsed ? "justify-center px-2" : "px-3"}
          `}
          onClick={() => (window.location.hash = "/dashboard")}
        >
          <LayoutDashboard className="size-[19px] text-[#21214f] shrink-0" />
          {!isCollapsed && (
            <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
              Дашборд
            </span>
          )}
        </div>
        <div
          className={`
            bg-[#d2def8] rounded-[8px] flex items-center gap-2 cursor-pointer 
            hover:bg-[#c5d5f5] transition-colors py-2
            ${isCollapsed ? "justify-center px-2" : "px-3"}
          `}
          onClick={() => (window.location.hash = "/courses")}
        >
          <Book className="size-[19px] text-[#21214f] shrink-0" />
          {!isCollapsed && (
            <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
              Курсы
            </span>
          )}
        </div>
        <div
          className={`
            bg-[#d2def8] rounded-[8px] flex items-center gap-2 cursor-pointer 
            hover:bg-[#c5d5f5] transition-colors py-2
            ${isCollapsed ? "justify-center px-2" : "px-3"}
          `}
          onClick={() => (window.location.hash = "/reviews")}
        >
          <FileCheck className="size-[19px] text-[#21214f] shrink-0" />
          {!isCollapsed && (
            <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
              Рецензии
            </span>
          )}
        </div>
        <div
          className={`
            bg-[#d2def8] rounded-[8px] flex items-center gap-2 cursor-pointer 
            hover:bg-[#c5d5f5] transition-colors py-2
            ${isCollapsed ? "justify-center px-2" : "px-3"}
          `}
          onClick={() => (window.location.hash = "/reviews/received")}
        >
          <MessageSquare className="size-[19px] text-[#21214f] shrink-0" />
          {!isCollapsed && (
            <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
              Полученные отзывы
            </span>
          )}
        </div>
        <div
          className={`
            bg-[#d2def8] rounded-[8px] flex items-center gap-2 cursor-pointer 
            hover:bg-[#c5d5f5] transition-colors py-2
            ${isCollapsed ? "justify-center px-2" : "px-3"}
          `}
          onClick={() => (window.location.hash = "/gradebook")}
        >
          <BookOpen className="size-[19px] text-[#21214f] shrink-0" />
          {!isCollapsed && (
            <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
              Журнал оценок
            </span>
          )}
        </div>
        <div
          className={`
            bg-[#d2def8] rounded-[8px] flex items-center gap-2 cursor-pointer 
            hover:bg-[#c5d5f5] transition-colors py-2
            ${isCollapsed ? "justify-center px-2" : "px-3"}
          `}
          onClick={() => (window.location.hash = "/inbox")}
        >
          <Bell className="size-[19px] text-[#21214f] shrink-0" />
          {!isCollapsed && (
            <span className="text-[18px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] tracking-[-0.54px]">
              Уведомления
            </span>
          )}
        </div>
      </nav>

      {/* Footer section - pinned to bottom, STABLE position */}
      <div className="shrink-0">
        {/* Profile - Фиксированная высота с divider */}
        <div className="border-t-2 border-[#c7c7c7]">
          <div className="h-[72px] flex items-center px-3">
            <ProfileDropdown collapsed={isCollapsed} userName="Студент" />
          </div>
        </div>
      </div>
    </div>
  );
}
