import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { NavItem } from "../model/navItems";

import { FOCUS_RING } from "./sidenav-styles";
import { SideNavBrand } from "./SideNavBrand";
import { SideNavFooter } from "./SideNavFooter";
import { SideNavList } from "./SideNavList";

interface MobileDrawerSideNavProps {
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
}

export function MobileDrawerSideNav({ isOpen, navItems, onClose }: MobileDrawerSideNavProps) {
  const { t } = useTranslation();
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-sidebar transform transition-transform duration-300 w-[85vw] max-w-[340px] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.08)" }}
    >
      <div className="flex flex-col h-full">
        <SideNavBrand
          collapsed={false}
          rightSlot={
            <button
              onClick={onClose}
              className={`w-6 h-6 flex items-center justify-center rounded-[5px] text-[--text-tertiary] hover:bg-surface-hover hover:text-[--text-primary] transition-colors duration-150 ${FOCUS_RING}`}
              aria-label={t("nav.closeMenu")}
            >
              <X className="w-4 h-4" />
            </button>
          }
        />

        <SideNavList items={navItems} collapsed={false} onItemClick={onClose} />

        <SideNavFooter collapsed={false} onItemClick={onClose} />
      </div>
    </div>
  );
}
