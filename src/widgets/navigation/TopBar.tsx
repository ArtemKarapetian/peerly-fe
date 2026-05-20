import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ProfileDropdown } from "./ProfileDropdown.tsx";

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
}

export function TopBar({ onMenuClick, title = "Peerly" }: TopBarProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-card border-b border-surface-border h-[64px] flex items-center px-4 shrink-0 justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0"
          aria-label={t("widget.topBar.openMenu")}
        >
          <Menu className="size-6 text-foreground" />
        </button>
        <h1 title={title} className="text-lg font-medium text-[--text-primary] truncate min-w-0">
          {title}
        </h1>
      </div>
      <div className="flex items-center shrink-0">
        <ProfileDropdown />
      </div>
    </div>
  );
}
