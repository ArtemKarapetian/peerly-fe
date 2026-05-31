import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { VerifyShell } from "./VerifyShell";

export function VerifiedView() {
  const { t } = useTranslation();
  return (
    <VerifyShell>
      <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-success" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">
        {t("page.verifyEmail.emailVerified")}
      </h1>
      <p className="text-sm text-muted-foreground">{t("page.verifyEmail.redirecting")}</p>
    </VerifyShell>
  );
}
