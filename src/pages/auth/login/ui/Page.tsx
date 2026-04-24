import { type TFunction } from "i18next";
import { AlertCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { ApiError } from "@/shared/api";
import { isFlagEnabled } from "@/shared/lib/feature-flags";
import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";

import { useAuth } from "@/entities/user";

import { PublicLayout } from "@/widgets/public-layout";

function getLoginErrorMessage(err: unknown, t: TFunction): string {
  if (err instanceof ApiError) {
    switch (err.status) {
      case 400:
        return t("auth.badRequest");
      case 401:
        return t("auth.invalidCredentials");
      case 403:
        return t("auth.accountForbidden");
      case 404:
        return t("auth.userNotFound");
      case 429:
        return t("auth.tooManyAttempts");
      default:
        if (err.status >= 500) return t("auth.serverError");
        return t("auth.loginFailed");
    }
  }
  if (err instanceof TypeError) return t("auth.networkError");
  return t("auth.loginFailed");
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const enablePasswordReset = isFlagEnabled("enablePasswordReset");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setTouched({ email: true, password: true });

    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      const session = await login({
        email: email.trim().toLowerCase(),
        password,
      });
      const target = session.role === "Teacher" ? "/teacher/courses" : "/student/courses";
      void navigate(target);
    } catch (err) {
      setError(getLoginErrorMessage(err, t));
    } finally {
      setIsLoading(false);
    }
  };

  const getEmailError = () => {
    if (!touched.email) return "";
    if (!email.trim()) return t("auth.requiredField");
    return "";
  };
  const getPasswordError = () => {
    if (!touched.password) return "";
    if (!password.trim()) return t("auth.requiredField");
    return "";
  };

  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 tablet:py-12">
        <div className="w-full max-w-[440px]">
          <div className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
                {t("auth.login")}
              </h1>
              <p className="text-[15px] text-muted-foreground">{t("auth.loginSubtitle")}</p>
            </div>

            {error && (
              <div className="bg-destructive/10 border-2 border-destructive/50 rounded-lg px-4 py-3 flex items-start gap-3">
                <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onBlur={() => setTouched({ ...touched, email: true })}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
                error={getEmailError()}
              />

              <PasswordInput
                label={t("auth.password")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onBlur={() => setTouched({ ...touched, password: true })}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                error={getPasswordError()}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={!email.trim() || !password.trim()}
                >
                  {isLoading ? t("auth.loggingIn") : t("auth.signIn")}
                </Button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              {enablePasswordReset && (
                <div className="text-center">
                  <Link
                    to="/reset-password"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
              )}

              <div className="text-center border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">{t("auth.noAccount")}</p>
                <Link to="/register" className="text-sm font-medium text-primary hover:underline">
                  {t("auth.createAccount")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
