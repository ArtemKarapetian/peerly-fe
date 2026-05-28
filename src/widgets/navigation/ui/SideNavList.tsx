import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import { isItemActive, type NavItem } from "../model/navItems";

import { FOCUS_RING, getNavItemClass } from "./sidenav-styles";

interface SideNavListProps {
  items: NavItem[];
  collapsed: boolean;
  onItemClick?: () => void;
}

export function SideNavList({ items, collapsed, onItemClick }: SideNavListProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="flex-1 py-2 px-2.5 overflow-y-auto space-y-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isItemActive(currentPath, item.hash, items);
        const layoutClass = collapsed ? "justify-center px-2" : "gap-2.5 px-2.5";
        return (
          <Link
            key={item.hash}
            to={item.hash}
            onClick={onItemClick}
            className={`flex items-center rounded-2sm transition-colors duration-150 py-[7px] ${FOCUS_RING} ${layoutClass} ${getNavItemClass(active)}`}
            title={collapsed ? t(item.labelKey) : undefined}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-sm">{t(item.labelKey)}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
