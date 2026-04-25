import { Info, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function AboutCard() {
  const { t } = useTranslation();

  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
          <Info className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-[20px] font-medium text-foreground">{t("widget.about.title")}</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-[15px] text-muted-foreground">{t("widget.about.security")}</span>
          <Link
            to="/security"
            className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
          >
            {t("widget.about.passwordAnd2FA")}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-[15px] text-muted-foreground">{t("widget.about.appVersion")}</span>
          <span className="text-[15px] font-medium text-foreground">v1.0.0</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-[15px] text-muted-foreground">
            {t("widget.about.systemStatus")}
          </span>
          <Link
            to="/status"
            className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
          >
            {t("widget.about.checkStatus")}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-[15px] text-muted-foreground">{t("widget.about.termsOfUse")}</span>
          <Link
            to="/terms"
            className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
          >
            {t("widget.about.read")}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-[15px] text-muted-foreground">
            {t("widget.about.privacyPolicy")}
          </span>
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
          >
            {t("widget.about.read")}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
