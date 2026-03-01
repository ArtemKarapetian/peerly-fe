import { MessageCircle } from "lucide-react";

import { useFeatureFlags } from "@/shared/lib/feature-flags-provider";

export function SupportLinkCard() {
  const { flags } = useFeatureFlags();

  if (!flags.supportChat) return null;

  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6">
      <div className="flex items-start gap-3">
        <MessageCircle className="w-6 h-6 text-accent-foreground flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-[20px] font-medium text-foreground mb-2">Поддержка</h2>
          <p className="text-[14px] text-muted-foreground mb-4">
            Нужна помощь? Свяжитесь с нашей службой поддержки
          </p>
          <a
            href="#/support/chat"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[14px] font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            Чат с поддержкой
          </a>
        </div>
      </div>
    </div>
  );
}
