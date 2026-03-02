import { Info, ExternalLink } from "lucide-react";

export function AboutCard() {
  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
          <Info className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-[20px] font-medium text-foreground">О приложении</h2>
      </div>

      <div className="space-y-4">
        {/* Security Link */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-[15px] text-muted-foreground">Безопасность</span>
          <a
            href="#/security"
            className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
          >
            Пароль и 2FA
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* App Version */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-[15px] text-muted-foreground">Версия приложения</span>
          <span className="text-[15px] font-medium text-foreground">v1.0.0</span>
        </div>

        {/* Status Page Link */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-[15px] text-muted-foreground">Статус системы</span>
          <a
            href="#/status"
            className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
          >
            Проверить статус
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Terms Link */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-[15px] text-muted-foreground">Условия использования</span>
          <a
            href="#/terms"
            className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
          >
            Читать
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Privacy Policy Link */}
        <div className="flex items-center justify-between py-3">
          <span className="text-[15px] text-muted-foreground">Политика конфиденциальности</span>
          <a
            href="#/privacy"
            className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
          >
            Читать
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
