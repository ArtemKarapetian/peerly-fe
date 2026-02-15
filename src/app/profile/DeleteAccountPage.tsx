import { useState } from "react";
import { AppShell } from "@/app/components/AppShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { AlertTriangle, Trash2, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/providers/auth.tsx";

/**
 * DeleteAccountPage - Account deletion flow with multi-step confirmation
 */

export default function DeleteAccountPage() {
  const { logout } = useAuth();
  const [step, setStep] = useState<"confirm" | "success">("confirm");

  // Confirmation state
  const [understoodConsequences, setUnderstoodConsequences] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");

  const textMatches =
    confirmText.toUpperCase() === "УДАЛИТЬ" || confirmText.toUpperCase() === "DELETE";
  const canDelete = understoodConsequences && textMatches && password.length > 0;

  const handleDelete = () => {
    if (!canDelete) return;

    // Clear all demo state from localStorage
    const keysToKeep = ["theme"]; // Keep theme preference
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Show success state
    setStep("success");
  };

  const handleGoToLanding = () => {
    logout(); // Clear auth state
    window.location.hash = "/";
  };

  if (step === "success") {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Success message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Аккаунт удалён</h1>
            <p className="text-muted-foreground">
              Ваш аккаунт и все связанные данные успешно удалены из системы Peerly.
            </p>
          </div>

          {/* Additional info */}
          <div className="bg-muted/50 rounded-lg p-4 text-left">
            <p className="text-sm text-muted-foreground">
              Мы сожалеем, что вы покидаете нас. Если вы передумаете, вы всегда можете создать новый
              аккаунт.
            </p>
          </div>

          {/* Action */}
          <button
            onClick={handleGoToLanding}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            На главную страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppShell title="Удаление аккаунта">
      <div className="max-w-[800px]">
        <Breadcrumbs
          items={[{ label: "Настройки", href: "#/settings" }, { label: "Удаление аккаунта" }]}
        />

        <div className="mt-6 space-y-6">
          {/* Back link */}
          <a
            href="#/settings"
            className="inline-flex items-center gap-2 text-sm text-accent-blue hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к настройкам
          </a>

          {/* Warning card */}
          <div className="bg-destructive/5 dark:bg-destructive/10 border-2 border-destructive/20 rounded-[20px] p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-destructive mb-2">Удаление аккаунта</h1>
                <p className="text-sm text-muted-foreground">
                  Это действие необратимо и приведёт к безвозвратной потере всех ваших данных,
                  включая оценки, отзывы и доступ к курсам.
                </p>
              </div>
            </div>
          </div>

          {/* Consequences card */}
          <div className="bg-card border border-border rounded-[20px] p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Что произойдёт при удалении аккаунта:
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Потеря доступа:</strong> вы больше не сможете
                  войти в систему
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Удаление работ:</strong> все ваши сабмишены и
                  файлы будут удалены
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Потеря отзывов:</strong> все написанные вами
                  рецензии будут удалены
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">История оценок:</strong> весь ваш прогресс и
                  оценки будут потеряны
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Личные данные:</strong> вся информация профиля
                  и настройки удаляются
                </span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-[12px]">
              <p className="text-sm text-foreground/80">
                <strong>Важно:</strong> Если вы уже провели peer review для других студентов,
                удаление может повлиять на их оценки. Рекомендуем сначала связаться с преподавателем
                курса.
              </p>
            </div>
          </div>

          {/* Confirmation steps */}
          <div className="bg-card border border-border rounded-[20px] p-6">
            <h2 className="text-lg font-semibold text-foreground mb-5">Подтверждение удаления</h2>

            <div className="space-y-6">
              {/* Step 1: Checkbox */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    1
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Подтвердите понимание последствий
                  </span>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={understoodConsequences}
                    onChange={(e) => setUnderstoodConsequences(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-2 border-input bg-background text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  />
                  <span className="text-sm text-foreground flex-1">
                    Я понимаю последствия удаления аккаунта и подтверждаю, что это действие
                    необратимо
                  </span>
                </label>
              </div>

              {/* Step 2: Confirm text */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    2
                  </div>
                  <span className="text-sm font-medium text-foreground">Введите кодовое слово</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Введите "УДАЛИТЬ" для подтверждения
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="УДАЛИТЬ"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-destructive focus:ring-2 focus:ring-destructive/20 focus:outline-none transition-colors font-mono text-sm"
                  />
                  {confirmText && !textMatches && (
                    <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                      <span>⚠</span>
                      Текст не совпадает. Введите точно: УДАЛИТЬ
                    </p>
                  )}
                  {textMatches && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <span>✓</span>
                      Текст подтверждён
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3: Password */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    3
                  </div>
                  <span className="text-sm font-medium text-foreground">Введите ваш пароль</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    Пароль (демо)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите ваш пароль"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    В demo-режиме подойдёт любой пароль
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col tablet:flex-row gap-3">
            <button
              onClick={handleDelete}
              disabled={!canDelete}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                canDelete
                  ? "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              }`}
            >
              <Trash2 className="w-5 h-5" />
              Удалить аккаунт
            </button>
            <a
              href="#/settings"
              className="tablet:w-auto px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent transition-colors font-medium text-center"
            >
              Отмена
            </a>
          </div>

          {/* Help section */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Нужна помощь?</strong> Если у вас возникли
              проблемы или вы хотите обсудить альтернативы, свяжитесь с нами:{" "}
              <a href="mailto:support@peerly.edu" className="text-accent-blue hover:underline">
                support@peerly.edu
              </a>
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
