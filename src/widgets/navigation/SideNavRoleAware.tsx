import { useRole } from "@/entities/user";

import { getNavItemsForRole } from "./model/navItems";
import { DesktopSideNav } from "./ui/DesktopSideNav";
import { MobileDrawerSideNav } from "./ui/MobileDrawerSideNav";

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

export function SideNav({ variant, isOpen = false, onClose, onToggleCollapse }: SideNavProps) {
  const { currentRole } = useRole();
  const showRoleSwitcher = import.meta.env.DEV;
  const navItems = getNavItemsForRole(currentRole);

  if (variant === "mobile-drawer") {
    return (
      <MobileDrawerSideNav
        isOpen={isOpen}
        navItems={navItems}
        showRoleSwitcher={showRoleSwitcher}
        onClose={() => onClose?.()}
      />
    );
  }

  const collapsed = variant === "desktop-collapsed" || variant === "tablet-collapsed";

  return (
    <DesktopSideNav
      collapsed={collapsed}
      showToggleButton
      showRoleSwitcher={showRoleSwitcher}
      navItems={navItems}
      onToggleCollapse={onToggleCollapse}
    />
  );
}
