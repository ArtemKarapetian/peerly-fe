import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { useDemoFlags } from "@/shared/lib/demo-flags-provider";
import { Card } from "@/shared/ui";

export function SupportLinkCard() {
  const { t } = useTranslation();
  const { flags } = useDemoFlags();

  if (!flags.supportChat) return null;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <MessageCircle className="w-6 h-6 text-accent-foreground flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-xl font-medium text-foreground mb-2">{t("widget.support.title")}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t("widget.support.subtitle")}</p>
          <Link
            to={ROUTES.supportChat}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            {t("widget.support.chatButton")}
          </Link>
        </div>
      </div>
    </Card>
  );
}
