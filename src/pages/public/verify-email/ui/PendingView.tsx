import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button.tsx";

import { VerifyShell } from "./VerifyShell";

interface PendingViewProps {
  email: string;
  resending: boolean;
  resendCooldown: number;
  onResend: () => void;
}

export function PendingView({ email, resending, resendCooldown, onResend }: PendingViewProps) {
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
        <p className="text-sm text-muted-foreground">{t("page.verifyEmail.openEmailAndFollow")}</p>
      </div>

      {email && (
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={onResend}
          isLoading={resending}
          disabled={resending || resendCooldown > 0}
        >
          {resendCooldown > 0
            ? t("page.verifyEmail.resendIn", { seconds: resendCooldown })
            : t("page.verifyEmail.resendEmail")}
        </Button>
      )}

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">{t("page.verifyEmail.checkSpam")}</p>
        <Link to={ROUTES.login} className="text-sm text-primary hover:underline">
          {t("page.verifyEmail.backToLogin")}
        </Link>
      </div>
    </VerifyShell>
  );
}
