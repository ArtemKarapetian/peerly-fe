import { AlertTriangle, LogOut } from "lucide-react";

import { useFeatureFlags } from "@/shared/lib/feature-flags-provider";

import { useAuth } from "@/entities/user";

export function DangerZoneCard() {
  const { logout } = useAuth();
  const { flags } = useFeatureFlags();

  const handleLogout = () => {
    if (confirm("Вы уверены, что хотите выйти из системы?")) {
      logout();
      window.location.hash = "/login";
    }
  };

  return (
    <div className="bg-card border-2 border-destructive rounded-[20px] p-6 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-[20px] font-medium text-destructive mb-2">Опасная зона</h2>
          <p className="text-[14px] text-muted-foreground mb-4">
            Выйти из системы или удалить аккаунт
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-[12px] hover:bg-muted/80 transition-colors text-[14px] font-medium"
            >
              <LogOut className="w-4 h-4" />
              Выйти из системы
            </button>
            {flags.deleteAccount && (
              <button
                onClick={() => {
                  window.location.hash = "/offboarding/delete-account";
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-[12px] hover:bg-destructive/80 transition-colors text-[14px] font-medium"
              >
                Удалить аккаунт
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
