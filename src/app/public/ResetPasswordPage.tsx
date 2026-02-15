import { useState, FormEvent } from "react";
import { PublicLayout } from "@/app/components/PublicLayout";
import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";
import { CheckCircle } from "lucide-react";

/**
 * ResetPasswordPage - Password reset flow
 *
 * Step 1: Enter login
 * Step 2: Enter new password + confirm
 * Step 3: Success message
 */

interface FormErrors {
  login?: string;
  newPassword?: string;
  confirmPassword?: string;
}

type Step = "login" | "password" | "success";

export default function ResetPasswordPage() {
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

  // Валидация поля
  const validateField = (field: keyof FormErrors, value: string) => {
    const newErrors = { ...errors };

    if (field === "login") {
      if (!value.trim()) {
        newErrors.login = "Введите логин";
      } else {
        delete newErrors.login;
      }
    }

    if (field === "newPassword") {
      if (!value) {
        newErrors.newPassword = "Введите новый пароль";
      } else if (value.length < 8) {
        newErrors.newPassword = "Пароль должен содержать минимум 8 символов";
      } else {
        delete newErrors.newPassword;
      }

      // Проверяем совпадение, если уже введён confirmPassword
      if (confirmPassword && value !== confirmPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      } else if (confirmPassword && value === confirmPassword) {
        delete newErrors.confirmPassword;
      }
    }

    if (field === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Подтвердите пароль";
      } else if (value !== newPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  // Обработка потери фокуса
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

  // Шаг 1: Продолжить с логином
  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();

    setTouched({ ...touched, login: true });
    validateField("login", login);

    if (!login.trim() || errors.login) {
      return;
    }

    setIsLoading(true);
    // Имитация проверки пользователя
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    // Переход к шагу 2
    setStep("password");
  };

  // Шаг 2: Сохранить новый пароль
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
    // Имитация сохранения пароля
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    // Переход к успеху
    setStep("success");
  };

  // Шаг 3: Успех
  if (step === "success") {
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
                <h1 className="text-2xl font-semibold text-foreground">Пароль обновлён</h1>
                <p className="text-sm text-muted-foreground">
                  Ваш пароль успешно изменён. Теперь вы можете войти с новым паролем.
                </p>
              </div>

              {/* Back to Login Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => (window.location.hash = "/login")}
              >
                Вернуться ко входу
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Шаг 1: Ввод логина
  if (step === "login") {
    return (
      <PublicLayout maxWidth="md" showLoginButton={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
          <div className="w-full max-w-[420px]">
            <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6">
              {/* Header */}
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-foreground">Сброс пароля</h1>
                <p className="text-sm text-muted-foreground">
                  Введите ваш логин для восстановления доступа
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleContinue} className="space-y-4">
                {/* Login Field */}
                <Input
                  label="Логин"
                  value={login}
                  onChange={(e) => {
                    setLogin(e.target.value);
                    if (touched.login) {
                      validateField("login", e.target.value);
                    }
                  }}
                  onBlur={() => handleBlur("login")}
                  placeholder="Введите логин"
                  error={touched.login ? errors.login : undefined}
                  disabled={isLoading}
                  autoComplete="username"
                  autoFocus
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!login.trim() || !!errors.login}
                  isLoading={isLoading}
                >
                  {isLoading ? "Проверка..." : "Продолжить"}
                </Button>
              </form>

              {/* Back to Login Link */}
              <div className="text-center">
                <a href="#/login" className="text-sm text-primary hover:underline">
                  Вернуться к входу
                </a>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Шаг 2: Ввод нового пароля
  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 desktop:py-12">
        <div className="w-full max-w-[420px]">
          <div className="bg-card border border-border rounded-xl p-6 tablet:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-foreground">Новый пароль</h1>
              <p className="text-sm text-muted-foreground">
                Пользователь: <strong>{login}</strong>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password Field */}
              <PasswordInput
                label="Новый пароль"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (touched.newPassword) {
                    validateField("newPassword", e.target.value);
                  }
                }}
                onBlur={() => handleBlur("newPassword")}
                placeholder="Минимум 8 символов"
                error={touched.newPassword ? errors.newPassword : undefined}
                disabled={isLoading}
                autoComplete="new-password"
                autoFocus
              />

              {/* Confirm Password Field */}
              <PasswordInput
                label="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) {
                    validateField("confirmPassword", e.target.value);
                  }
                }}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Повторите новый пароль"
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
                disabled={isLoading}
                autoComplete="new-password"
              />

              {/* Password Requirements */}
              <div className="bg-muted/50 border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  Требования к паролю:
                </p>
                <ul className="space-y-1">
                  <li
                    className={`text-xs flex items-center gap-2 ${
                      newPassword.length >= 8 ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-lg leading-none">•</span>
                    Минимум 8 символов
                  </li>
                  <li
                    className={`text-xs flex items-center gap-2 ${
                      newPassword && confirmPassword && newPassword === confirmPassword
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-lg leading-none">•</span>
                    Пароли совпадают
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
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
                {isLoading ? "Сохранение..." : "Сохранить новый пароль"}
              </Button>
            </form>

            {/* Back Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("login")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                ← Назад
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
