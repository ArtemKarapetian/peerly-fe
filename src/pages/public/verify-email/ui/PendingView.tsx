import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import { VerifyShell } from "./VerifyShell";

interface PendingViewProps {
  email: string;
}

export function PendingView({ email }: PendingViewProps) {
  const { t } = useTranslation();
  return (
    <VerifyShell>
      <div className="w-16 h-16 bg-info-light rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-info" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{t("page.verifyEmail.title")}</h1>
        {email ? (
          <p className="text-sm text-muted-foreground">
            {t("page.verifyEmail.weSentEmail")} <strong className="text-foreground">{email}</strong>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{t("page.verifyEmail.noEmailHint")}</p>
        )}
      </div>
    </VerifyShell>
  );
}
