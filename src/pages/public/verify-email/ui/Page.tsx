import { CheckCircle, Mail, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button.tsx";
import { Input } from "@/shared/ui/input.tsx";

import { PublicLayout } from "@/widgets/public-layout";

type VerificationState = "pending" | "verified" | "expired";

export default function VerifyEmailPage() {
  // позволяет открывать конкретное состояние через ?state=verified — для демо/QA
  const getInitialState = (): VerificationState => {
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get("state") as VerificationState;
    return ["pending", "verified", "expired"].includes(stateParam) ? stateParam : "pending";
  };

  const getInitialEmail = (): string => {
    const storedEmail = localStorage.getItem("pendingVerificationEmail");
    return storedEmail || "ivan.petrov@university.edu";
  };

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState<VerificationState>(getInitialState());
  const [email, setEmail] = useState(getInitialEmail());
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<string | null>(null);

  const handleResendEmail = async () => {
    setIsLoading(true);
    // демо-задержка вместо реального POST /verify/resend
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    toast.success(t("page.verifyEmail.emailSent"), {
      description: t("page.verifyEmail.checkEmail", { email }),
    });
    setLastSentTime(new Date().toLocaleTimeString());
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    setEmail(newEmail);
    setShowEmailModal(false);
    setNewEmail("");
    toast.success(t("page.verifyEmail.emailChanged"), {
      description: t("page.verifyEmail.emailSentTo", { email: newEmail }),
    });
    localStorage.setItem("pendingVerificationEmail", newEmail);
  };

  if (state === "verified") {
    return (
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6 text-center">
              <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  {t("page.verifyEmail.emailVerified")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("page.verifyEmail.emailVerifiedDesc")}
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => void navigate("/student/courses")}
              >
                {t("page.verifyEmail.goToApp")}
              </Button>

              {/* демо-переключатель состояний */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  {t("page.verifyEmail.demoSwitchState")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setState("pending")}
                    className="flex-1 text-xs py-2 px-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setState("expired")}
                    className="flex-1 text-xs py-2 px-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    Expired
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (state === "expired") {
    return (
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  {t("page.verifyEmail.linkExpired")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("page.verifyEmail.linkExpiredDesc")}
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  setState("pending");
                  toast.success(t("page.verifyEmail.newLinkSent"));
                }}
              >
                {t("page.verifyEmail.sendNewLink")}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("page.resetPassword.backToLogin")}
                </Link>
              </div>

              {/* демо-переключатель состояний */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  {t("page.verifyEmail.demoSwitchState")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setState("pending")}
                    className="flex-1 text-xs py-2 px-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setState("verified")}
                    className="flex-1 text-xs py-2 px-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    Verified
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <>
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6 text-center">
              <div className="w-16 h-16 bg-info-light rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-info" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  {t("page.verifyEmail.title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("page.verifyEmail.weSentEmail")}{" "}
                  <strong className="text-foreground">{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("page.verifyEmail.openEmailAndFollow")}
                </p>
                {lastSentTime && (
                  <p className="text-xs text-muted-foreground">
                    {t("page.verifyEmail.lastSent")}: {lastSentTime}
                  </p>
                )}
                <div className="bg-warning-light border border-warning rounded-lg p-3 mt-3">
                  <p className="text-xs text-warning">
                    <strong>Demo only:</strong> {t("page.verifyEmail.demoNote")}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => void handleResendEmail()}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? t("page.verifyEmail.sending") : t("page.verifyEmail.resendEmail")}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="text-sm text-primary hover:underline"
                >
                  {t("page.verifyEmail.changeEmail")}
                </button>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">{t("page.verifyEmail.checkSpam")}</p>
              </div>

              {/* демо-переключатель состояний */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  {t("page.verifyEmail.demoSwitchState")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setState("verified")}
                    className="flex-1 text-xs py-2 px-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    Verified
                  </button>
                  <button
                    onClick={() => setState("expired")}
                    className="flex-1 text-xs py-2 px-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    Expired
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-[400px] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {t("page.verifyEmail.changeEmail")}
              </h2>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setNewEmail("");
                }}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("page.verifyEmail.enterNewEmail")}</p>

              <Input
                label={t("page.verifyEmail.newEmail")}
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
              />

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setShowEmailModal(false);
                    setNewEmail("");
                  }}
                  disabled={isLoading}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => void handleChangeEmail()}
                  isLoading={isLoading}
                  disabled={!newEmail.trim() || !newEmail.includes("@") || isLoading}
                >
                  {isLoading ? t("page.resetPassword.saving") : t("common.save")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
