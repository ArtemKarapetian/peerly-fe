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
    <div className="bg-white border-b border-[--surface-border] h-[64px] flex items-center px-4 shrink-0 justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={t("widget.topBar.openMenu")}
        >
          <Menu className="size-6 text-[#21214f]" />
        </button>
        <h1 className="text-lg font-medium text-[--text-primary]">{title}</h1>
      </div>
      <div className="flex items-center">
        <ProfileDropdown userName={t("roles.student")} />
      </div>
    </div>
  );
}
