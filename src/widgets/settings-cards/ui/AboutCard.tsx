import { Info, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { Card } from "@/shared/ui";

export function AboutCard() {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center">
          <Info className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-xl font-medium text-foreground">{t("widget.about.title")}</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-15 text-muted-foreground">{t("widget.about.security")}</span>
          <Link
            to={ROUTES.security}
            className="inline-flex items-center gap-2 text-sm text-accent-foreground hover:opacity-80 transition-opacity"
          >
            {t("widget.about.password")}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-15 text-muted-foreground">{t("widget.about.appVersion")}</span>
          <span className="text-15 font-medium text-foreground">v1.0.0</span>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-15 text-muted-foreground">{t("widget.about.termsOfUse")}</span>
          <Link
            to={ROUTES.terms}
            className="inline-flex items-center gap-2 text-sm text-accent-foreground hover:opacity-80 transition-opacity"
          >
            {t("widget.about.read")}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
