import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button.tsx";

import { VerifyShell } from "./VerifyShell";

interface ErrorViewProps {
  state: "expired" | "error";
  email: string;
  errorMsg: string;
  resending: boolean;
  resendCooldown: number;
  onResend: () => void;
}

export function ErrorView({
  state,
  email,
  errorMsg,
  resending,
  resendCooldown,
  onResend,
}: ErrorViewProps) {
  const { t } = useTranslation();
  return (
    <VerifyShell>
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          {state === "expired"
            ? t("page.verifyEmail.linkExpired")
            : t("page.verifyEmail.confirmFailed")}
        </h1>
        {errorMsg ? (
          <p className="text-sm text-muted-foreground whitespace-pre-line">{errorMsg}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{t("page.verifyEmail.linkExpiredDesc")}</p>
        )}
      </div>
      {email && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onResend}
          isLoading={resending}
          disabled={resending || resendCooldown > 0}
        >
          {resendCooldown > 0
            ? t("page.verifyEmail.resendIn", { seconds: resendCooldown })
            : t("page.verifyEmail.sendNewLink")}
        </Button>
      )}
      <Link
        to={ROUTES.login}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
      >
        {t("page.verifyEmail.backToLogin")}
      </Link>
    </VerifyShell>
  );
}
