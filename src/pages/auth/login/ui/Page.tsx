import { AlertCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { isFlagEnabled } from "@/shared/lib/feature-flags";
import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";

import { useAuth } from "@/entities/user";
import { authenticateUser } from "@/entities/user/model/userStorage.ts";

import { PublicLayout } from "@/widgets/public-layout";

/**
 * LoginPage - Authentication screen
 *
 * Features:
 * - Single identifier field (email OR username)
 * - Demo credentials support
 * - Realistic error states
 * - Feature-flagged password reset
 */

export function LoginPage() {
  const { t } = useTranslation();
  const { login: authLogin } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    identifier: false,
    password: false,
  });

  const enablePasswordReset = isFlagEnabled("enablePasswordReset");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Mark all fields as touched
    setTouched({ identifier: true, password: true });

    // Validate inputs
    if (!identifier.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Attempt authentication
    const user = authenticateUser(identifier, password);

    if (user) {
      // Success - login and navigate
      authLogin();
      window.location.hash = "/courses";
    } else {
      // Failed - show error
      setIsLoading(false);
      setError(t("auth.invalidCredentials"));
    }
  };

  // Show field-level errors only when touched
  const getIdentifierError = () => {
    if (!touched.identifier) return "";
    if (!identifier.trim()) return t("auth.requiredField");
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
          {/* Card */}
          <div className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
                {t("auth.login")}
              </h1>
              <p className="text-[15px] text-muted-foreground">{t("auth.loginSubtitle")}</p>
            </div>

            {/* Demo credentials hint */}
            <div className="bg-accent/50 border border-border rounded-lg px-3.5 py-2.5">
              <p className="text-[13px] text-muted-foreground">
                <strong className="font-medium">Demo:</strong> {t("auth.demoCredentials")}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive/50 rounded-lg px-4 py-3 flex items-start gap-3">
                <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              {/* Identifier (username or email) */}
              <Input
                label={t("auth.emailOrUsername")}
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError(""); // Clear error on change
                }}
                onBlur={() => setTouched({ ...touched, identifier: true })}
                placeholder="demo or demo@example.com"
                autoComplete="username"
                disabled={isLoading}
                error={getIdentifierError()}
              />

              {/* Password */}
              <PasswordInput
                label={t("auth.password")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error on change
                }}
                onBlur={() => setTouched({ ...touched, password: true })}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                error={getPasswordError()}
              />

              {/* Submit button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={!identifier.trim() || !password.trim()}
                >
                  {isLoading ? t("auth.loggingIn") : t("auth.signIn")}
                </Button>
              </div>
            </form>

            {/* Footer links */}
            <div className="space-y-3 pt-2">
              {/* Forgot password link (feature flag controlled) */}
              {enablePasswordReset && (
                <div className="text-center">
                  <a
                    href="#/reset-password"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("auth.forgotPassword")}
                  </a>
                </div>
              )}

              {/* Register link */}
              <div className="text-center border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">{t("auth.noAccount")}</p>
                <a href="#/register" className="text-sm font-medium text-primary hover:underline">
                  {t("auth.createAccount")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
