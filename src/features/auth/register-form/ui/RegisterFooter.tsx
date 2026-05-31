import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

export function RegisterFooter() {
  const { t } = useTranslation();
  return (
    <div className="text-center border-t border-border pt-4">
      <p className="text-sm text-muted-foreground mb-2">{t("auth.alreadyHaveAccount")}</p>
      <Link to={ROUTES.login} className="text-sm font-medium text-primary hover:underline">
        {t("auth.signIn")}
      </Link>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {t("auth.agreeWith")}{" "}
          <Link to={ROUTES.terms} className="text-primary hover:underline">
            {t("auth.termsOfUse")}
          </Link>
        </p>
      </div>
    </div>
  );
}
