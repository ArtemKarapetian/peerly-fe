import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { NavItem } from "../model/navItems";

import { FOCUS_RING } from "./sidenav-styles";
import { SideNavBrand } from "./SideNavBrand";
import { SideNavFooter } from "./SideNavFooter";
import { SideNavList } from "./SideNavList";

interface DesktopSideNavProps {
  collapsed: boolean;
  showToggleButton: boolean;
  navItems: NavItem[];
  onToggleCollapse?: () => void;
}

export function DesktopSideNav({
  collapsed,
  showToggleButton,
  navItems,
  onToggleCollapse,
}: DesktopSideNavProps) {
  const { t } = useTranslation();
  const widthClass = collapsed ? "w-[72px]" : "w-[240px]";

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border h-screen flex flex-col shrink-0 transition-all duration-300 ${widthClass}`}
    >
      <SideNavBrand
        collapsed={collapsed}
        rightSlot={
          showToggleButton && (
            <button
              onClick={onToggleCollapse}
              className={`w-6 h-6 flex items-center justify-center rounded-[5px] text-[--text-tertiary] hover:bg-surface-hover hover:text-[--text-primary] transition-colors duration-150 ${FOCUS_RING} ${collapsed ? "mx-auto" : ""}`}
              aria-label={collapsed ? t("nav.expand") : t("nav.collapse")}
            >
              {collapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          )
        }
      />

      <SideNavList items={navItems} collapsed={collapsed} />

      <SideNavFooter collapsed={collapsed} />
    </div>
  );
}
