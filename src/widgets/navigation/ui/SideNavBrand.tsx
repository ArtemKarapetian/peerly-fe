import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

interface SideNavBrandProps {
  collapsed: boolean;
  rightSlot?: ReactNode;
}

export function SideNavBrand({ collapsed, rightSlot }: SideNavBrandProps) {
  return (
    <div className="flex items-center justify-between h-[56px] px-4 border-b border-[--surface-border] shrink-0">
      {!collapsed && (
        <Link
          to={ROUTES.dashboard}
          className="text-base font-semibold text-[--text-primary] tracking-[-0.4px] hover:opacity-70 transition-opacity"
        >
          Peerly
        </Link>
      )}
      {rightSlot}
    </div>
  );
}
