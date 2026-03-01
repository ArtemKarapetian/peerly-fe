import { Menu } from "lucide-react";

import { ProfileDropdown } from "./ProfileDropdown.tsx";

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
}

export function TopBar({ onMenuClick, title = "Peerly" }: TopBarProps) {
  return (
    <div className="bg-white border-b border-[--surface-border] h-[64px] flex items-center px-4 shrink-0 justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Открыть меню"
        >
          <Menu className="size-6 text-[#21214f]" />
        </button>
        <h1 className="text-lg font-medium text-[--text-primary]">{title}</h1>
      </div>
      <div className="flex items-center">
        <ProfileDropdown userName="Студент" />
      </div>
    </div>
  );
}
