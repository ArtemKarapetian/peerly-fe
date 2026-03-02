import { Trash2 } from "lucide-react";

export function SecurityDangerZoneCard() {
  return (
    <div className="bg-destructive/5 dark:bg-destructive/10 border-2 border-destructive/30 rounded-[20px] p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-destructive/10 rounded-[8px] flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-destructive" />
        </div>
        <h2 className="text-[20px] font-medium text-destructive">Опасная зона</h2>
      </div>

      <p className="text-[14px] text-muted-foreground mb-6">
        Необратимые действия, требующие особого внимания
      </p>

      <div className="p-4 bg-card border border-destructive/20 rounded-[12px]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-[15px] font-medium text-foreground mb-1">Удалить аккаунт</h3>
            <p className="text-[13px] text-muted-foreground">
              Безвозвратное удаление вашей учётной записи и всех связанных данных. Это действие
              нельзя отменить.
            </p>
          </div>
          <a
            href="#/offboarding/delete-account"
            className="flex items-center gap-2 px-4 py-2 border-2 border-destructive text-destructive rounded-[12px] hover:bg-destructive/10 transition-colors text-[14px] font-medium whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            Удалить аккаунт
          </a>
        </div>
      </div>
    </div>
  );
}
