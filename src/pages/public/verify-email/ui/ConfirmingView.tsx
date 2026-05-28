import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import { VerifyShell } from "./VerifyShell";

export function ConfirmingView() {
  const { t } = useTranslation();
  return (
    <VerifyShell>
      <div className="w-16 h-16 bg-info-light rounded-full flex items-center justify-center mx-auto animate-pulse">
        <Mail className="w-8 h-8 text-info" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">{t("page.verifyEmail.confirming")}</h1>
    </VerifyShell>
  );
}
