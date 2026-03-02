import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { CRUMBS } from "@/shared/config/breadcrumbs.ts";
import { useFeatureFlags } from "@/shared/lib/feature-flags-provider";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * SecurityPage - Security and Authentication Settings
 *
 * Sections:
 * 1. Change Password - With validation
 * 2. Two-Factor Authentication - Behind feature flag
 * 3. Active Sessions - Mock session management
 * 4. Danger Zone - Delete Account
 */

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function SecurityPage() {
  const { flags } = useFeatureFlags();

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showSetup2FA, setShowSetup2FA] = useState(false);

  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Chrome на Windows",
      location: "Москва, Россия",
      lastActive: "Сейчас",
      isCurrent: true,
    },
    {
      id: "2",
      device: "Safari на iPhone",
      location: "Москва, Россия",
      lastActive: "2 часа назад",
      isCurrent: false,
    },
    {
      id: "3",
      device: "Firefox на macOS",
      location: "Санкт-Петербург, Россия",
      lastActive: "1 день назад",
      isCurrent: false,
    },
  ]);

  // Password validation
  const validatePassword = (): boolean => {
    const errors: string[] = [];

    if (!passwordData.current) {
      errors.push("Введите текущий пароль");
    }
    if (!passwordData.new) {
      errors.push("Введите новый пароль");
    }
    if (passwordData.new && passwordData.new.length < 8) {
      errors.push("Новый пароль должен содержать минимум 8 символов");
    }
    if (passwordData.new && !/[A-Z]/.test(passwordData.new)) {
      errors.push("Пароль должен содержать заглавную букву");
    }
    if (passwordData.new && !/[0-9]/.test(passwordData.new)) {
      errors.push("Пароль должен содержать цифру");
    }
    if (passwordData.new !== passwordData.confirm) {
      errors.push("Пароли не совпадают");
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleChangePassword = () => {
    if (validatePassword()) {
      // Demo: Reset form and show success
      setPasswordData({ current: "", new: "", confirm: "" });
      setPasswordErrors([]);
      setShowPasswordSuccess(true);
      setTimeout(() => setShowPasswordSuccess(false), 3000);
    }
  };

  const handleSignOutSession = (sessionId: string) => {
    if (confirm("Вы уверены, что хотите завершить эту сессию?")) {
      setSessions(sessions.filter((s) => s.id !== sessionId));
    }
  };

  const handleSignOutAll = () => {
    if (confirm("Вы уверены, что хотите завершить все сессии, кроме текущей?")) {
      setSessions(sessions.filter((s) => s.isCurrent));
    }
  };

  const handleEnable2FA = () => {
    setShowSetup2FA(true);
  };

  const handleComplete2FASetup = () => {
    setTwoFactorEnabled(true);
    setShowSetup2FA(false);
  };

  const handleDisable2FA = () => {
    if (confirm("Вы уверены, что хотите отключить двухфакторную аутентификацию?")) {
      setTwoFactorEnabled(false);
    }
  };

  return (
    <AppShell title="Безопасность">
      <Breadcrumbs items={[CRUMBS.settings, { label: "Безопасность" }]} />

      <div className="mt-6 max-w-[800px]">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          Безопасность
        </h1>
        <p className="text-[16px] text-muted-foreground mb-8">
          Управление паролем и параметрами безопасности
        </p>

        {/* Success Toast */}
        {showPasswordSuccess && (
          <div className="mb-6 p-4 bg-accent rounded-[12px] flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-accent-foreground" />
            <p className="text-[14px] text-accent-foreground font-medium">
              Пароль успешно изменён!
            </p>
          </div>
        )}

        {/* 1. Change Password */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-[20px] font-medium text-foreground">Изменить пароль</h2>
          </div>

          <p className="text-[14px] text-muted-foreground mb-6">
            Используйте надёжный пароль для защиты вашей учётной записи
          </p>

          {/* Password Errors */}
          {passwordErrors.length > 0 && (
            <div className="mb-4 p-4 bg-destructive/10 border-2 border-destructive rounded-[12px]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-destructive mb-2">Ошибки валидации:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {passwordErrors.map((error, idx) => (
                      <li key={idx} className="text-[13px] text-destructive">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Текущий пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors"
                  placeholder="Введите текущий пароль"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Новый пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors"
                  placeholder="Введите новый пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-[12px] text-muted-foreground">
                Минимум 8 символов, включая заглавную букву и цифру
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors"
                  placeholder="Повторите новый пароль"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
            <button
              onClick={handleChangePassword}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium"
            >
              Изменить пароль
            </button>
            <button
              onClick={() => {
                setPasswordData({ current: "", new: "", confirm: "" });
                setPasswordErrors([]);
              }}
              className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium"
            >
              Отмена
            </button>
          </div>
        </div>

        {/* 2. Two-Factor Authentication */}
        {flags.twoFactor ? (
          <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-foreground" />
              </div>
              <h2 className="text-[20px] font-medium text-foreground">
                Двухфакторная аутентификация
              </h2>
            </div>

            <p className="text-[14px] text-muted-foreground mb-6">
              Добавьте дополнительный уровень защиты для вашей учётной записи
            </p>

            {!twoFactorEnabled && !showSetup2FA && (
              <div>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-[12px] mb-4">
                  <Smartphone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[14px] text-foreground mb-1 font-medium">2FA не настроена</p>
                    <p className="text-[13px] text-muted-foreground">
                      Используйте приложение-аутентификатор для генерации одноразовых кодов при
                      входе
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleEnable2FA}
                  className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium"
                >
                  Настроить 2FA
                </button>
              </div>
            )}

            {showSetup2FA && !twoFactorEnabled && (
              <div>
                <div className="bg-muted rounded-[12px] p-6 mb-4">
                  <h3 className="text-[16px] font-medium text-foreground mb-4">
                    Шаг 1: Отсканируйте QR-код
                  </h3>
                  {/* QR Code Placeholder */}
                  <div className="bg-card border-2 border-border rounded-[12px] w-[200px] h-[200px] mx-auto flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-muted rounded-[8px] mb-2 mx-auto" />
                      <p className="text-[12px] text-muted-foreground">QR-код (демо)</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-muted-foreground text-center mb-4">
                    Используйте Google Authenticator, Authy или другое приложение
                  </p>
                  <p className="text-[12px] text-muted-foreground text-center font-mono bg-card px-3 py-2 rounded-[8px]">
                    Ключ: DEMO KEY ABCD 1234 EFGH 5678
                  </p>
                </div>

                <div className="bg-muted rounded-[12px] p-6 mb-6">
                  <h3 className="text-[16px] font-medium text-foreground mb-4">
                    Шаг 2: Сохраните коды восстановления
                  </h3>
                  <div className="bg-card border-2 border-border rounded-[12px] p-4 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "1234-5678",
                        "9012-3456",
                        "7890-1234",
                        "4567-8901",
                        "2345-6789",
                        "6789-0123",
                      ].map((code, idx) => (
                        <div
                          key={idx}
                          className="text-[13px] font-mono text-foreground bg-muted px-3 py-2 rounded-[8px] text-center"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] text-muted-foreground">
                    Сохраните эти коды в надёжном месте. Они понадобятся для восстановления доступа.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleComplete2FASetup}
                    className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium"
                  >
                    Завершить настройку
                  </button>
                  <button
                    onClick={() => setShowSetup2FA(false)}
                    className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {twoFactorEnabled && (
              <div>
                <div className="flex items-start gap-3 p-4 bg-accent/20 border-2 border-accent rounded-[12px] mb-4">
                  <CheckCircle className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[14px] text-foreground mb-1 font-medium">2FA активирована</p>
                    <p className="text-[13px] text-muted-foreground">
                      Ваша учётная запись защищена двухфакторной аутентификацией
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDisable2FA}
                  className="px-6 py-3 border-2 border-destructive text-destructive rounded-[12px] hover:bg-destructive/10 transition-colors text-[15px] font-medium"
                >
                  Отключить 2FA
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-[8px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <h2 className="text-[20px] font-medium text-foreground">
                Двухфакторная аутентификация
              </h2>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted rounded-[12px]">
              <AlertTriangle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[14px] text-foreground mb-1">
                  2FA не включена в вашей организации
                </p>
                <p className="text-[13px] text-muted-foreground">
                  Обратитесь к администратору для активации этой функции
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Active Sessions */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
                <Monitor className="w-5 h-5 text-accent-foreground" />
              </div>
              <h2 className="text-[20px] font-medium text-foreground">Активные сессии</h2>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleSignOutAll}
                className="px-4 py-2 border-2 border-destructive text-destructive rounded-[12px] hover:bg-destructive/10 transition-colors text-[14px] font-medium"
              >
                Завершить все
              </button>
            )}
          </div>

          <p className="text-[14px] text-muted-foreground mb-6">
            Управление устройствами, с которых выполнен вход в систему
          </p>

          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-[12px] border-2 ${
                  session.isCurrent ? "border-accent bg-accent/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-5 h-5 text-muted-foreground" />
                      <h3 className="text-[15px] font-medium text-foreground">{session.device}</h3>
                      {session.isCurrent && (
                        <span className="inline-flex px-2 py-1 bg-accent text-accent-foreground rounded-[6px] text-[11px] font-medium uppercase tracking-wide">
                          Текущая
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Последняя активность: {session.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleSignOutSession(session.id)}
                      className="flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-[8px] transition-colors text-[14px]"
                      title="Завершить сессию"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Завершить</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {sessions.length === 1 && (
            <div className="mt-4 p-4 bg-muted rounded-[12px] text-center">
              <p className="text-[13px] text-muted-foreground">У вас только одна активная сессия</p>
            </div>
          )}
        </div>

        {/* 4. Danger Zone - Delete Account */}
        <div className="bg-destructive/5 dark:bg-destructive/10 border-2 border-destructive/30 rounded-[20px] p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-destructive/10 rounded-[8px] flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-[20px] font-medium text-destructive">Опасная зона</h2>
          </div>

          <p className="text-[14px] text-muted-foreground mb-6">
            Необратимые действия, требующие особого внимания
          </p>

          <div className="p-4 bg-card border border-destructive/20 rounded-[12px]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-[15px] font-medium text-foreground mb-1">Удалить аккаунт</h3>
                <p className="text-[13px] text-muted-foreground">
                  Безвозвратное удаление вашей учётной записи и всех связанных данных. Это действие
                  нельзя отменить.
                </p>
              </div>
              <a
                href="#/offboarding/delete-account"
                className="flex items-center gap-2 px-4 py-2 border-2 border-destructive text-destructive rounded-[12px] hover:bg-destructive/10 transition-colors text-[14px] font-medium whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4" />
                Удалить аккаунт
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
