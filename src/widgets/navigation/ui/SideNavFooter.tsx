import { Settings, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

import { RoleSwitcherPopover } from "../RoleSwitcherPopover.tsx";

import { FOCUS_RING, FOOTER_ITEM_CLASS } from "./sidenav-styles";

interface SideNavFooterProps {
  collapsed: boolean;
  showRoleSwitcher: boolean;
  onItemClick?: () => void;
}

export function SideNavFooter({ collapsed, showRoleSwitcher, onItemClick }: SideNavFooterProps) {
  const { t } = useTranslation();
  return (
    <div className="shrink-0">
      {showRoleSwitcher && (
        <div className="border-t border-[--surface-border] pt-2">
          <RoleSwitcherPopover collapsed={collapsed} />
        </div>
      )}

      <div className="border-t border-[--surface-border] px-2.5 py-2 space-y-0.5 pb-3">
        <FooterLink
          to={ROUTES.profile}
          icon={User}
          label={t("nav.profile")}
          collapsed={collapsed}
          onClick={onItemClick}
        />
        <FooterLink
          to={ROUTES.settings}
          icon={Settings}
          label={t("nav.settings")}
          collapsed={collapsed}
          onClick={onItemClick}
        />
      </div>
    </div>
  );
}

interface FooterLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}

function FooterLink({ to, icon: Icon, label, collapsed, onClick }: FooterLinkProps) {
  const layoutClass = collapsed ? "justify-center px-2" : "gap-2.5 px-2.5";
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center rounded-2sm transition-colors duration-150 py-[7px] ${FOCUS_RING} ${FOOTER_ITEM_CLASS} ${layoutClass}`}
      title={collapsed ? label : undefined}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
}
