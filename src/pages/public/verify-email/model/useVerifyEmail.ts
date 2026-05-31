import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { ApiError, humanizeApiError } from "@/shared/api";
import { STORAGE_KEYS } from "@/shared/config/constants";

import { authApi, defaultRouteForRole, useAuth } from "@/entities/user";

export type VerificationState = "pending" | "confirming" | "verified" | "expired" | "error";

const RESEND_COOLDOWN_SECONDS = 30;

export function useVerifyEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { confirmEmail } = useAuth();

  const tokenFromUrl = params.get("token") ?? params.get("Token");

  const [state, setState] = useState<VerificationState>(tokenFromUrl ? "confirming" : "pending");
  const [errorMsg, setErrorMsg] = useState("");
  const [email] = useState(() => localStorage.getItem(STORAGE_KEYS.pendingVerificationEmail) ?? "");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!tokenFromUrl) return;
    let cancelled = false;
    confirmEmail({ token: tokenFromUrl })
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
  }, [tokenFromUrl, confirmEmail, navigate, t]);

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

  return { state, errorMsg, email, resendCooldown, resending, handleResend };
}
