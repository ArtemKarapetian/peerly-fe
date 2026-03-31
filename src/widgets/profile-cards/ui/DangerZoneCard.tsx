import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/entities/user";

export function DangerZoneCard() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-card border border-border rounded-[20px] p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-medium text-foreground mb-1">
            {t("widget.profileDanger.logout")}
          </h2>
          <p className="text-[14px] text-muted-foreground">{t("widget.profileDanger.subtitle")}</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-[12px] hover:bg-muted/80 transition-colors text-[14px] font-medium"
        >
          <LogOut className="w-4 h-4" />
          {t("widget.profileDanger.logout")}
        </button>
      </div>
    </div>
  );
}
