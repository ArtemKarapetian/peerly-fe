import { CheckCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";

import { PublicLayout } from "@/widgets/public-layout";

interface FormErrors {
  login?: string;
  newPassword?: string;
  confirmPassword?: string;
}

type Step = "login" | "password" | "success";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("login");
  const [login, setLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    login: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (field: keyof FormErrors, value: string) => {
    const newErrors = { ...errors };

    if (field === "login") {
      if (!value.trim()) {
        newErrors.login = t("page.resetPassword.enterLogin");
      } else {
        delete newErrors.login;
      }
    }

    if (field === "newPassword") {
      if (!value) {
        newErrors.newPassword = t("page.resetPassword.enterNewPassword");
      } else if (value.length < 8) {
        newErrors.newPassword = t("page.resetPassword.minChars");
      } else {
        delete newErrors.newPassword;
      }

      // если уже ввели confirm — проверяем сразу, чтобы убрать stale-ошибку
      if (confirmPassword && value !== confirmPassword) {
        newErrors.confirmPassword = t("page.resetPassword.passwordsMismatch");
      } else if (confirmPassword && value === confirmPassword) {
        delete newErrors.confirmPassword;
      }
    }

    if (field === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = t("page.resetPassword.confirmPasswordError");
      } else if (value !== newPassword) {
        newErrors.confirmPassword = t("page.resetPassword.passwordsMismatch");
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched({ ...touched, [field]: true });

    if (field === "login") {
      validateField("login", login);
    } else if (field === "newPassword") {
      validateField("newPassword", newPassword);
    } else if (field === "confirmPassword") {
      validateField("confirmPassword", confirmPassword);
    }
  };

  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();

    setTouched({ ...touched, login: true });
    validateField("login", login);

    if (!login.trim() || errors.login) {
      return;
    }

    setIsLoading(true);
    // демо-задержка вместо реального запроса проверки логина
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    setStep("password");
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    setTouched({
      ...touched,
      newPassword: true,
      confirmPassword: true,
    });

    validateField("newPassword", newPassword);
    validateField("confirmPassword", confirmPassword);

    if (!newPassword || !confirmPassword || errors.newPassword || errors.confirmPassword) {
      return;
    }

    setIsLoading(true);
    // демо-задержка вместо реального API смены пароля
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    setStep("success");
  };

  if (step === "success") {
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
                  {t("page.resetPassword.passwordUpdated")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("page.resetPassword.passwordUpdatedDesc")}
                </p>
              </div>

              <Button variant="outline" className="w-full" onClick={() => void navigate("/login")}>
                {t("page.resetPassword.backToLogin")}
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (step === "login") {
    return (
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-foreground">
                  {t("page.resetPassword.title")}
                </h1>
                <p className="text-sm text-muted-foreground">{t("page.resetPassword.subtitle")}</p>
              </div>

              <form onSubmit={(e) => void handleContinue(e)} className="space-y-4">
                <Input
                  label={t("page.resetPassword.loginLabel")}
                  value={login}
                  onChange={(e) => {
                    setLogin(e.target.value);
                    if (touched.login) {
                      validateField("login", e.target.value);
                    }
                  }}
                  onBlur={() => handleBlur("login")}
                  placeholder={t("page.resetPassword.enterLogin")}
                  error={touched.login ? errors.login : undefined}
                  disabled={isLoading}
                  autoComplete="username"
                  autoFocus
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!login.trim() || !!errors.login}
                  isLoading={isLoading}
                >
                  {isLoading ? t("page.resetPassword.checking") : t("page.resetPassword.continue")}
                </Button>
              </form>

              <div className="text-center">
                <Link to="/login" className="text-sm text-primary hover:underline">
                  {t("page.resetPassword.backToLogin")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
        <div className="w-full max-w-[420px]">
          <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-foreground">
                {t("page.resetPassword.newPasswordTitle")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("page.resetPassword.user")}: <strong>{login}</strong>
              </p>
            </div>

            <form onSubmit={(e) => void handleResetPassword(e)} className="space-y-4">
              <PasswordInput
                label={t("page.resetPassword.newPasswordLabel")}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (touched.newPassword) {
                    validateField("newPassword", e.target.value);
                  }
                }}
                onBlur={() => handleBlur("newPassword")}
                placeholder={t("page.resetPassword.minCharsPlaceholder")}
                error={touched.newPassword ? errors.newPassword : undefined}
                disabled={isLoading}
                autoComplete="new-password"
                autoFocus
              />

              <PasswordInput
                label={t("page.resetPassword.confirmPasswordLabel")}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) {
                    validateField("confirmPassword", e.target.value);
                  }
                }}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder={t("page.resetPassword.repeatNewPassword")}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
                disabled={isLoading}
                autoComplete="new-password"
              />

              <div className="bg-muted/50 border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  {t("page.resetPassword.passwordRequirements")}
                </p>
                <ul className="space-y-1">
                  <li
                    className={`text-xs flex items-center gap-2 ${
                      newPassword.length >= 8 ? "text-success" : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-lg leading-none">•</span>
                    {t("page.resetPassword.minChars")}
                  </li>
                  <li
                    className={`text-xs flex items-center gap-2 ${
                      newPassword && confirmPassword && newPassword === confirmPassword
                        ? "text-success"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-lg leading-none">•</span>
                    {t("page.resetPassword.passwordsMatch")}
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  !!errors.newPassword ||
                  !!errors.confirmPassword
                }
                isLoading={isLoading}
              >
                {isLoading
                  ? t("page.resetPassword.saving")
                  : t("page.resetPassword.saveNewPassword")}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("login")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {t("common.back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
