import { Flag, Save, Search, X, ChevronDown, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

import { ROUTES } from "@/shared/config/routes.ts";
import { useFeatureFlags } from "@/shared/lib/feature-flags-provider";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminFlagsPage - Фиче-флаги и настройки платформы
 *
 * Функции:
 * - Переключение экспериментальных функций
 * - Поиск и фильтрация флагов
 * - Tenant scoping (per-organization overrides)
 * - Сохранение в localStorage
 */

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  category: "ui" | "performance" | "experimental" | "integration";
  status: "stable" | "beta" | "alpha";
  enabled: boolean;
  tenantOverrides?: Record<string, boolean>;
}

const FEATURE_FLAGS: FeatureFlag[] = [
  // Real platform feature flags
  {
    id: "ff-support-chat",
    key: "supportChat",
    name: "Чат поддержки",
    description: "Включить виджет чата для связи с поддержкой",
    category: "integration",
    status: "stable",
    enabled: false,
  },
  {
    id: "ff-two-factor",
    key: "twoFactor",
    name: "Двухфакторная аутентификация",
    description: "Включить 2FA для дополнительной безопасности учетных записей",
    category: "integration",
    status: "beta",
    enabled: false,
  },
  {
    id: "ff-email-confirm",
    key: "enableEmailConfirmation",
    name: "Подтверждение email",
    description: "Требовать подтверждение email при регистрации",
    category: "integration",
    status: "stable",
    enabled: false,
  },
  {
    id: "ff-password-reset",
    key: "enablePasswordReset",
    name: "Восстановление пароля",
    description: "Включить функцию восстановления пароля через email",
    category: "integration",
    status: "stable",
    enabled: false,
  },
  // Demo feature flags
  {
    id: "ff1",
    key: "review_hotkeys",
    name: "Горячие клавиши для рецензирования",
    description: "Быстрые клавиши для навигации и действий в интерфейсе рецензирования",
    category: "ui",
    status: "stable",
    enabled: true,
  },
  {
    id: "ff2",
    key: "autosave",
    name: "Автосохранение",
    description: "Автоматическое сохранение черновиков рецензий каждые 30 секунд",
    category: "ui",
    status: "stable",
    enabled: true,
  },
  {
    id: "ff3",
    key: "dark_mode",
    name: "Тёмная тема",
    description: "Тёмная цветовая схема для всего интерфейса",
    category: "ui",
    status: "beta",
    enabled: false,
  },
  {
    id: "ff4",
    key: "inline_comments",
    name: "Комментарии в коде",
    description: "Возможность оставлять комментарии прямо в коде работы",
    category: "ui",
    status: "alpha",
    enabled: false,
  },
  {
    id: "ff5",
    key: "ai_suggestions",
    name: "AI-подсказки",
    description: "Автоматические рекомендации по улучшению рецензий с помощью ИИ",
    category: "experimental",
    status: "alpha",
    enabled: false,
  },
  {
    id: "ff6",
    key: "lazy_loading",
    name: "Ленивая загрузка",
    description: "Отложенная загрузка больших списков для ускорения интерфейса",
    category: "performance",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff7",
    key: "virtual_scrolling",
    name: "Виртуальный скроллинг",
    description: "Оптимизация рендеринга для длинных списков работ и рецензий",
    category: "performance",
    status: "stable",
    enabled: true,
  },
  {
    id: "ff8",
    key: "video_reviews",
    name: "Видео-рецензии",
    description: "Возможность записывать видео-объяснения к рецензиям",
    category: "experimental",
    status: "alpha",
    enabled: false,
  },
  {
    id: "ff9",
    key: "github_sync",
    name: "Синхронизация с GitHub",
    description: "Автоматическая синхронизация работ из GitHub репозиториев",
    category: "integration",
    status: "beta",
    enabled: false,
  },
  {
    id: "ff10",
    key: "real_time_collab",
    name: "Совместное редактирование",
    description: "Рецензирование нескольких человек одновременно в реальном времени",
    category: "experimental",
    status: "alpha",
    enabled: false,
  },
  {
    id: "ff11",
    key: "advanced_analytics",
    name: "Расширенная аналитика",
    description: "Детальная статистика и визуализация данных о рецензировании",
    category: "ui",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff12",
    key: "batch_operations",
    name: "Пакетные операции",
    description: "Массовые действия над несколькими работами или рецензиями",
    category: "ui",
    status: "stable",
    enabled: true,
  },
];

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(FEATURE_FLAGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { updateFlag: updateRealFlag } = useFeatureFlags();

  // Available tenants
  const availableTenants = [
    { id: "org1", name: "HSE" },
    { id: "org2", name: "MGUSiT" },
    { id: "org3", name: "Demo University" },
  ];

  const handleToggleGlobal = (flagId: string) => {
    setFlags(
      flags.map((flag) => (flag.id === flagId ? { ...flag, enabled: !flag.enabled } : flag)),
    );
    setHasChanges(true);
  };

  const handleToggleTenant = (flagId: string, tenantId: string) => {
    setFlags(
      flags.map((flag) => {
        if (flag.id !== flagId) return flag;

        const currentOverrides = flag.tenantOverrides || {};
        const newOverrides = { ...currentOverrides };

        if (tenantId in newOverrides) {
          delete newOverrides[tenantId];
        } else {
          newOverrides[tenantId] = !flag.enabled;
        }

        return { ...flag, tenantOverrides: newOverrides };
      }),
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save to localStorage for demo flags
    localStorage.setItem("admin_feature_flags", JSON.stringify(flags));

    // Sync real feature flags with FeatureFlagsContext
    flags.forEach((flag) => {
      if (
        flag.key === "supportChat" ||
        flag.key === "twoFactor" ||
        flag.key === "enableEmailConfirmation" ||
        flag.key === "enablePasswordReset"
      ) {
        updateRealFlag(flag.key, flag.enabled);
      }
    });

    logAuditEntry("UPDATE_FEATURE_FLAGS", "FeatureFlags", "Фиче-флаги обновлены");
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const logAuditEntry = (action: string, resource: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem("admin_audit_logs") || "[]");
    logs.unshift({
      id: `audit-${Date.now()}`,
      userId: "flags-system",
      adminId: "u3",
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("admin_audit_logs", JSON.stringify(logs));
  };

  // Filter flags
  const filteredFlags = flags.filter((flag) => {
    const matchesSearch =
      searchQuery === "" ||
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || flag.category === filterCategory;
    const matchesStatus = filterStatus === "all" || flag.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stable":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
            <CheckCircle className="w-3 h-3" />
            Стабильно
          </span>
        );
      case "beta":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            Beta
          </span>
        );
      case "alpha":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f3e5f5] text-[#8e24aa] rounded-[6px] text-[11px] font-medium">
            <AlertCircle className="w-3 h-3" />
            Alpha
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      ui: "bg-[#e9f5ff] text-[#5b8def]",
      performance: "bg-[#e8f5e9] text-[#4caf50]",
      experimental: "bg-[#f3e5f5] text-[#8e24aa]",
      integration: "bg-[#fff4e5] text-[#ff9800]",
    };

    const labels = {
      ui: "UI",
      performance: "Производительность",
      experimental: "Экспериментальное",
      integration: "Интеграция",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 rounded-[6px] text-[11px] font-medium ${styles[category as keyof typeof styles]}`}
      >
        {labels[category as keyof typeof labels]}
      </span>
    );
  };

  const stats = {
    total: flags.length,
    enabled: flags.filter((f) => f.enabled).length,
    stable: flags.filter((f) => f.status === "stable").length,
    beta: flags.filter((f) => f.status === "beta").length,
    alpha: flags.filter((f) => f.status === "alpha").length,
  };

  return (
    <AppShell title="Фиче-флаги">
      <Breadcrumbs
        items={[
          { label: "Администратор", href: ROUTES.adminOverview },
          { label: "Настройки", href: ROUTES.adminSettings },
          { label: "Фиче-флаги" },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Фиче-флаги и настройки платформы
          </h1>
          <p className="text-[16px] text-[#767692]">
            Управление экспериментальными функциями и возможностями системы
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[16px] p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4caf50] rounded-full flex items-center justify-center">
                <Save className="w-4 h-4 text-white" />
              </div>
              <p className="text-[14px] font-medium text-[#4caf50]">
                ✓ Фиче-флаги успешно сохранены
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Всего</p>
            <p className="text-[24px] font-medium text-[#21214f]">{stats.total}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Включено</p>
            <p className="text-[24px] font-medium text-[#4caf50]">{stats.enabled}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Stable</p>
            <p className="text-[24px] font-medium text-[#4caf50]">{stats.stable}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Beta</p>
            <p className="text-[24px] font-medium text-[#ff9800]">{stats.beta}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Alpha</p>
            <p className="text-[24px] font-medium text-[#8e24aa]">{stats.alpha}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Поиск
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#767692]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Название или ключ..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-[200px]">
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Категория
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
              >
                <option value="all">Все</option>
                <option value="ui">UI</option>
                <option value="performance">Производительность</option>
                <option value="experimental">Экспериментальное</option>
                <option value="integration">Интеграция</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-[200px]">
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Статус
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
              >
                <option value="all">Все</option>
                <option value="stable">Stable</option>
                <option value="beta">Beta</option>
                <option value="alpha">Alpha</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(searchQuery || filterCategory !== "all" || filterStatus !== "all") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-[#e6e8ee]">
              <span className="text-[13px] text-[#767692]">Фильтры:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f9f9f9] text-[#21214f] rounded-[6px] text-[12px]">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-[#d4183d]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f9f9f9] text-[#21214f] rounded-[6px] text-[12px]">
                  {filterCategory}
                  <button onClick={() => setFilterCategory("all")} className="hover:text-[#d4183d]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f9f9f9] text-[#21214f] rounded-[6px] text-[12px]">
                  {filterStatus}
                  <button onClick={() => setFilterStatus("all")} className="hover:text-[#d4183d]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Flags List */}
        <div className="space-y-3 mb-6">
          {filteredFlags.map((flag) => {
            const isExpanded = expandedFlag === flag.id;
            const hasOverrides =
              flag.tenantOverrides && Object.keys(flag.tenantOverrides).length > 0;

            return (
              <div
                key={flag.id}
                className="bg-white border-2 border-[#e6e8ee] rounded-[16px] overflow-hidden"
              >
                {/* Main Row */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[16px] font-medium text-[#21214f]">{flag.name}</h3>
                        {getCategoryBadge(flag.category)}
                        {getStatusBadge(flag.status)}
                        {hasOverrides && (
                          <span className="inline-flex px-2 py-1 bg-[#e9f5ff] text-[#5b8def] rounded-[6px] text-[11px] font-medium">
                            {Object.keys(flag.tenantOverrides!).length} переопр.
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#767692] mb-2">{flag.description}</p>
                      <p className="text-[12px] text-[#767692] font-mono">Key: {flag.key}</p>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={flag.enabled}
                          onChange={() => handleToggleGlobal(flag.id)}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-[#e6e8ee] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#4caf50]"></div>
                      </label>

                      {/* Expand Button */}
                      <button
                        onClick={() => setExpandedFlag(isExpanded ? null : flag.id)}
                        className="p-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors"
                      >
                        <ChevronDown
                          className={`w-5 h-5 text-[#767692] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tenant Overrides */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 border-t-2 border-[#e6e8ee]">
                    <div className="pt-4">
                      <h4 className="text-[14px] font-medium text-[#21214f] mb-3">
                        Переопределения по организациям
                      </h4>
                      <div className="space-y-2">
                        {availableTenants.map((tenant) => {
                          const hasOverride =
                            flag.tenantOverrides && tenant.id in flag.tenantOverrides;
                          const overrideValue = hasOverride
                            ? flag.tenantOverrides![tenant.id]
                            : flag.enabled;

                          return (
                            <div
                              key={tenant.id}
                              className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-[14px] text-[#21214f] font-medium">
                                  {tenant.name}
                                </span>
                                {hasOverride ? (
                                  <span className="text-[11px] px-2 py-1 bg-[#e9f5ff] text-[#5b8def] rounded-[6px] font-medium">
                                    Переопределено
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-[#767692]">
                                    (глобальное: {flag.enabled ? "вкл" : "выкл"})
                                  </span>
                                )}
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={overrideValue}
                                  onChange={() => handleToggleTenant(flag.id, tenant.id)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-[#e6e8ee] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4caf50]"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[12px] text-[#767692] mt-3">
                        💡 Переопределения позволяют включить/выключить функцию для конкретной
                        организации, независимо от глобальной настройки.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredFlags.length === 0 && (
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-12 text-center">
            <Flag className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
            <h3 className="text-[18px] font-medium text-[#21214f] mb-2">Флаги не найдены</h3>
            <p className="text-[14px] text-[#767692]">
              Попробуйте изменить параметры поиска или фильтры
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-[#fff4e5] border-2 border-[#ff9800] rounded-[16px] p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff9800] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">
                Экспериментальные функции
              </h4>
              <p className="text-[13px] text-[#767692]">
                Функции со статусом Alpha и Beta находятся в разработке и могут работать
                нестабильно. Используйте их с осторожностью в production-среде.
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
        </div>
      </div>
    </AppShell>
  );
}
