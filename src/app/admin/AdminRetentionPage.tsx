import { useState } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ROUTES } from "@/shared/config/routes.ts";
import { Database, AlertTriangle, Clock, Save, RotateCcw } from "lucide-react";

/**
 * AdminRetentionPage - Политики хранения данных
 *
 * Функции:
 * - Периоды хранения для submissions, logs, plugin reports
 * - Предупреждения о рискованных настройках
 * - Сохранение в localStorage
 */

interface RetentionPolicy {
  submissions: number;
  logs: number;
  pluginReports: number;
  archivedCourses: number;
  userSessions: number;
}

const DEFAULT_RETENTION: RetentionPolicy = {
  submissions: 365,
  logs: 90,
  pluginReports: 180,
  archivedCourses: 730,
  userSessions: 30,
};

const RISKY_THRESHOLDS = {
  submissions: 30,
  logs: 7,
  pluginReports: 14,
  archivedCourses: 180,
  userSessions: 7,
};

// Initialize from localStorage
const getInitialPolicy = (): RetentionPolicy => {
  const stored = localStorage.getItem("admin_retention_policy");
  return stored ? JSON.parse(stored) : DEFAULT_RETENTION;
};

export default function AdminRetentionPage() {
  const [policy, setPolicy] = useState<RetentionPolicy>(getInitialPolicy);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (key: keyof RetentionPolicy, value: string) => {
    const numValue = parseInt(value) || 0;
    setPolicy({ ...policy, [key]: numValue });
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem("admin_retention_policy", JSON.stringify(policy));
    logAuditEntry("UPDATE_RETENTION_POLICY", "RetentionPolicy", "Политики хранения обновлены");
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (!confirm("Сбросить все политики к значениям по умолчанию?")) return;
    setPolicy(DEFAULT_RETENTION);
    setHasChanges(true);
  };

  const logAuditEntry = (action: string, resource: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem("admin_audit_logs") || "[]");
    logs.unshift({
      id: `audit-${Date.now()}`,
      userId: "retention-system",
      adminId: "u3",
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("admin_audit_logs", JSON.stringify(logs));
  };

  const isRisky = (key: keyof RetentionPolicy, value: number): boolean => {
    return value < RISKY_THRESHOLDS[key];
  };

  const retentionSettings = [
    {
      key: "submissions" as keyof RetentionPolicy,
      label: "Работы студентов (Submissions)",
      description: "Период хранения загруженных работ и файлов",
      icon: "📄",
      warningText: "Слишком короткий срок может помешать апелляциям и аудиту",
    },
    {
      key: "logs" as keyof RetentionPolicy,
      label: "Системные логи",
      description: "Период хранения журналов действий и событий",
      icon: "📋",
      warningText: "Короткий срок затруднит расследование инцидентов",
    },
    {
      key: "pluginReports" as keyof RetentionPolicy,
      label: "Отчёты плагинов",
      description: "Результаты проверок плагиатом, линтером и т.д.",
      icon: "🔌",
      warningText: "Может потребоваться для повторного анализа",
    },
    {
      key: "archivedCourses" as keyof RetentionPolicy,
      label: "Архивные курсы",
      description: "Период хранения архивированных курсов",
      icon: "📦",
      warningText: "Данные курса будут удалены безвозвратно",
    },
    {
      key: "userSessions" as keyof RetentionPolicy,
      label: "Пользовательские сессии",
      description: "История активных сессий пользователей",
      icon: "🔐",
      warningText: "Короткий срок затруднит отслеживание безопасности",
    },
  ];

  const hasAnyRiskySettings = retentionSettings.some((setting) =>
    isRisky(setting.key, policy[setting.key]),
  );

  return (
    <AppShell title="Политики хранения">
      <Breadcrumbs
        items={[
          { label: "Admin", href: ROUTES.adminOverview },
          { label: "Политики", href: ROUTES.adminPolicies },
          { label: "Хранение данных" },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Политики хранения данных
          </h1>
          <p className="text-[16px] text-[#767692]">
            Настройка периодов хранения для различных типов данных в системе
          </p>
        </div>

        {/* Global Warning Banner */}
        {hasAnyRiskySettings && (
          <div className="bg-[#fff5f5] border-2 border-[#d4183d] rounded-[16px] p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-[#d4183d] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14px] font-medium text-[#d4183d] mb-1">
                  ⚠️ Обнаружены рискованные настройки
                </h4>
                <p className="text-[13px] text-[#767692]">
                  Некоторые периоды хранения установлены ниже рекомендуемых значений. Это может
                  привести к потере важных данных или затруднить аудит.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[16px] p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4caf50] rounded-full flex items-center justify-center">
                <Save className="w-4 h-4 text-white" />
              </div>
              <p className="text-[14px] font-medium text-[#4caf50]">
                ✓ Политики хранения успешно сохранены
              </p>
            </div>
          </div>
        )}

        {/* Retention Settings */}
        <div className="space-y-4 mb-6">
          {retentionSettings.map((setting) => {
            const value = policy[setting.key];
            const risky = isRisky(setting.key, value);

            return (
              <div
                key={setting.key}
                className={`bg-white border-2 rounded-[20px] p-6 transition-colors ${
                  risky ? "border-[#d4183d]" : "border-[#e6e8ee]"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-[32px] flex-shrink-0">{setting.icon}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-[18px] font-medium text-[#21214f] mb-1">{setting.label}</h3>
                    <p className="text-[13px] text-[#767692] mb-4">{setting.description}</p>

                    {/* Input Row */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-1 max-w-[300px]">
                        <Clock className="w-4 h-4 text-[#767692]" />
                        <input
                          type="number"
                          min="1"
                          value={value}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          className={`flex-1 px-4 py-2 border-2 rounded-[8px] text-[14px] focus:outline-none transition-colors ${
                            risky
                              ? "border-[#d4183d] focus:border-[#d4183d]"
                              : "border-[#e6e8ee] focus:border-[#5b8def]"
                          }`}
                        />
                        <span className="text-[14px] text-[#767692] min-w-[60px]">дней</span>
                      </div>

                      {/* Info Badge */}
                      <div className="text-[12px] text-[#767692]">
                        {value === 0 ? (
                          <span className="inline-flex px-2 py-1 bg-[#f5f5f5] rounded-[6px]">
                            Отключено
                          </span>
                        ) : value < 30 ? (
                          <span className="text-[#d4183d]">~{Math.floor(value / 7)} нед.</span>
                        ) : value < 365 ? (
                          <span>~{Math.floor(value / 30)} мес.</span>
                        ) : (
                          <span>~{Math.floor(value / 365)} г.</span>
                        )}
                      </div>
                    </div>

                    {/* Warning */}
                    {risky && (
                      <div className="flex items-start gap-2 p-3 bg-[#fff5f5] rounded-[8px]">
                        <AlertTriangle className="w-4 h-4 text-[#d4183d] flex-shrink-0 mt-0.5" />
                        <p className="text-[12px] text-[#d4183d]">
                          <strong>Предупреждение:</strong> {setting.warningText}
                        </p>
                      </div>
                    )}

                    {/* Recommended */}
                    {!risky && value < DEFAULT_RETENTION[setting.key] && (
                      <div className="flex items-start gap-2 p-3 bg-[#fff4e5] rounded-[8px]">
                        <AlertTriangle className="w-4 h-4 text-[#ff9800] flex-shrink-0 mt-0.5" />
                        <p className="text-[12px] text-[#767692]">
                          Рекомендуемое значение:{" "}
                          <strong>{DEFAULT_RETENTION[setting.key]} дней</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4 mb-6">
          <div className="flex gap-3">
            <Database className="w-5 h-5 text-[#5b8def] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">О политиках хранения</h4>
              <p className="text-[13px] text-[#767692] mb-2">
                Данные старше указанного срока будут автоматически удалены из системы. Удаление
                происходит необратимо и не может быть отменено.
              </p>
              <p className="text-[13px] text-[#767692]">
                Установка значения <strong>0</strong> отключает автоматическое удаление (данные
                хранятся бессрочно).
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-6 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
              hasChanges
                ? "bg-[#5b8def] text-white hover:bg-[#4a7de8]"
                : "bg-[#e6e8ee] text-[#767692] cursor-not-allowed"
            }`}
          >
            <Save className="w-5 h-5" />
            Сохранить изменения
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[14px] font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Сбросить к умолчаниям
          </button>
        </div>
      </div>
    </AppShell>
  );
}
