import { Trash2 } from "lucide-react";
import { useState } from "react";

interface ConfirmationFormProps {
  onDelete: () => void;
}

export function ConfirmationForm({ onDelete }: ConfirmationFormProps) {
  const [understoodConsequences, setUnderstoodConsequences] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");

  const textMatches =
    confirmText.toUpperCase() === "УДАЛИТЬ" || confirmText.toUpperCase() === "DELETE";
  const canDelete = understoodConsequences && textMatches && password.length > 0;

  return (
    <>
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
                Я понимаю последствия удаления аккаунта и подтверждаю, что это действие необратимо
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
                Введите &quot;УДАЛИТЬ&quot; для подтверждения
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
          onClick={() => canDelete && onDelete()}
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
          <strong className="text-foreground">Нужна помощь?</strong> Если у вас возникли проблемы
          или вы хотите обсудить альтернативы, свяжитесь с нами:{" "}
          <a href="mailto:support@peerly.edu" className="text-accent-blue hover:underline">
            support@peerly.edu
          </a>
        </p>
      </div>
    </>
  );
}
