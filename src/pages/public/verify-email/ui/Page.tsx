import { CheckCircle, Mail, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { ApiError, humanizeApiError } from "@/shared/api";
import { STORAGE_KEYS } from "@/shared/config/constants";
import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button.tsx";

import { authApi, defaultRouteForRole, useAuth } from "@/entities/user";

import { PublicLayout } from "@/widgets/public-layout";

type VerificationState = "pending" | "confirming" | "verified" | "expired" | "error";

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { confirmEmail } = useAuth();

  const tokenFromUrl = params.get("token");
  const userIdFromUrl = params.get("userId");

  const [state, setState] = useState<VerificationState>(tokenFromUrl ? "confirming" : "pending");
  const [errorMsg, setErrorMsg] = useState("");
  const [email] = useState(() => localStorage.getItem(STORAGE_KEYS.pendingVerificationEmail) ?? "");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!tokenFromUrl || !userIdFromUrl) return;
    let cancelled = false;
    confirmEmail({ token: tokenFromUrl, userId: userIdFromUrl })
      .then((session) => {
        if (cancelled) return;
        localStorage.removeItem(STORAGE_KEYS.pendingVerificationEmail);
        setState("verified");
        setTimeout(() => {
          if (!cancelled) void navigate(defaultRouteForRole(session.role));
        }, 800);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const isExpired = err instanceof ApiError && (err.status === 410 || err.status === 400);
        setState(isExpired ? "expired" : "error");
        setErrorMsg(humanizeApiError(err, t("page.verifyEmail.confirmFailed")));
      });
    return () => {
      cancelled = true;
    };
  }, [tokenFromUrl, userIdFromUrl, confirmEmail, navigate, t]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!email || resending || resendCooldown > 0) return;
    setResending(true);
    try {
      await authApi.resendConfirmationEmail(email);
      toast.success(t("page.verifyEmail.emailSent"), {
        description: t("page.verifyEmail.checkEmail", { email }),
      });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      toast.error(humanizeApiError(err, t("page.verifyEmail.resendFailed")));
    } finally {
      setResending(false);
    }
  };

  if (state === "confirming") {
    return (
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
          <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-info-light rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Mail className="w-8 h-8 text-info" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              {t("page.verifyEmail.confirming")}
            </h1>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (state === "verified") {
    return (
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
          <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              {t("page.verifyEmail.emailVerified")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("page.verifyEmail.redirecting")}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (state === "expired" || state === "error") {
    return (
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
          <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-destructive" />
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
                <p className="text-sm text-muted-foreground">
                  {t("page.verifyEmail.linkExpiredDesc")}
                </p>
              )}
            </div>
            {email ? (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => void handleResend()}
                isLoading={resending}
                disabled={resending || resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? t("page.verifyEmail.resendIn", { seconds: resendCooldown })
                  : t("page.verifyEmail.sendNewLink")}
              </Button>
            ) : null}
            <Link
              to={ROUTES.login}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
            >
              {t("page.resetPassword.backToLogin")}
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-info-light rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-info" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              {t("page.verifyEmail.title")}
            </h1>
            {email ? (
              <p className="text-sm text-muted-foreground">
                {t("page.verifyEmail.weSentEmail")}{" "}
                <strong className="text-foreground">{email}</strong>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{t("page.verifyEmail.noEmailHint")}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {t("page.verifyEmail.openEmailAndFollow")}
            </p>
          </div>

          {email ? (
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => void handleResend()}
              isLoading={resending}
              disabled={resending || resendCooldown > 0}
            >
              {resendCooldown > 0
                ? t("page.verifyEmail.resendIn", { seconds: resendCooldown })
                : t("page.verifyEmail.resendEmail")}
            </Button>
          ) : null}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">{t("page.verifyEmail.checkSpam")}</p>
            <Link to={ROUTES.login} className="text-sm text-primary hover:underline">
              {t("page.resetPassword.backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
