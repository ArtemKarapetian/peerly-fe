import { useState } from "react";
import { PublicLayout } from "@/widgets/public-layout";
import { Button } from "@/shared/ui/button.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { CheckCircle, Mail, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

/**
 * VerifyEmailPage - Email verification UI flow
 *
 * Three states:
 * 1. "pending" - Check your email
 * 2. "verified" - Success
 * 3. "expired" - Invalid/expired link
 *
 * Demo-switchable via URL params or manual state change
 */

type VerificationState = "pending" | "verified" | "expired";

export default function VerifyEmailPage() {
  // Check URL param for initial state (e.g., ?state=verified)
  const getInitialState = (): VerificationState => {
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const stateParam = urlParams.get("state") as VerificationState;
    return ["pending", "verified", "expired"].includes(stateParam) ? stateParam : "pending";
  };

  // Get email from localStorage or use default
  const getInitialEmail = (): string => {
    const storedEmail = localStorage.getItem("pendingVerificationEmail");
    return storedEmail || "ivan.petrov@university.edu";
  };

  const [state, setState] = useState<VerificationState>(getInitialState());
  const [email, setEmail] = useState(getInitialEmail());
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<string | null>(null);

  // Resend email handler
  const handleResendEmail = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    toast.success("Письмо отправлено", {
      description: `Проверьте ${email}`,
    });
    setLastSentTime(new Date().toLocaleTimeString());
  };

  // Change email handler
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
    toast.success("Email изменён", {
      description: `Письмо отправлено на ${newEmail}`,
    });
    localStorage.setItem("pendingVerificationEmail", newEmail);
  };

  // State 2: Verified Success
  if (state === "verified") {
    return (
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6 text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">Email подтверждён</h1>
                <p className="text-sm text-muted-foreground">
                  Ваш адрес электронной почты успешно подтверждён. Теперь вы можете пользоваться
                  всеми функциями платформы.
                </p>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => (window.location.hash = "/courses")}
              >
                Перейти в приложение
              </Button>

              {/* Demo State Switcher */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Demo: Переключить состояние</p>
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

  // State 3: Expired Link
  if (state === "expired") {
    return (
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6 text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>

              {/* Error Message */}
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">Ссылка устарела</h1>
                <p className="text-sm text-muted-foreground">
                  Срок действия ссылки для подтверждения истёк. Пожалуйста, запросите новую ссылку
                  для подтверждения email.
                </p>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  setState("pending");
                  toast.success("Новая ссылка отправлена");
                }}
              >
                Отправить новую ссылку
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <a
                  href="#/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Вернуться к входу
                </a>
              </div>

              {/* Demo State Switcher */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Demo: Переключить состояние</p>
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

  // State 1: Pending - Check Your Email (Default)
  return (
    <>
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6 text-center">
              {/* Email Icon */}
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">Подтверждение email</h1>
                <p className="text-sm text-muted-foreground">
                  Мы отправили письмо на <strong className="text-foreground">{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Откройте письмо и перейдите по ссылке для подтверждения.
                </p>
                {lastSentTime && (
                  <p className="text-xs text-muted-foreground">
                    Последняя отправка: {lastSentTime}
                  </p>
                )}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-amber-800">
                    <strong>Demo only:</strong> Реальные письма не отправляются. Используйте
                    переключатели состояний ниже.
                  </p>
                </div>
              </div>

              {/* Resend Button */}
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleResendEmail}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Отправка..." : "Отправить письмо ещё раз"}
              </Button>

              {/* Change Email Link */}
              <div className="text-center">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Изменить email
                </button>
              </div>

              {/* Help Text */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Не получили письмо? Проверьте папку «Спам» или «Промоакции»
                </p>
              </div>

              {/* Demo State Switcher */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Demo: Переключить состояние</p>
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

      {/* Change Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-[400px] shadow-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Изменить email</h2>
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

            {/* Modal Content */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Введите новый адрес электронной почты. Мы отправим письмо для подтверждения.
              </p>

              <Input
                label="Новый email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
              />

              {/* Modal Actions */}
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
                  Отмена
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleChangeEmail}
                  isLoading={isLoading}
                  disabled={!newEmail.trim() || !newEmail.includes("@") || isLoading}
                >
                  {isLoading ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
