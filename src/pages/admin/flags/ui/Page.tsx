import { Flag, Save, Search, X, ChevronDown, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { useFeatureFlags } from "@/shared/lib/feature-flags-provider";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminFlagsPage - Feature flags & platform settings
 */

interface FeatureFlag {
  id: string;
  key: string;
  nameKey: string;
  descriptionKey: string;
  category: "ui" | "performance" | "experimental" | "integration";
  status: "stable" | "beta" | "alpha";
  enabled: boolean;
  tenantOverrides?: Record<string, boolean>;
}

const FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: "ff-support-chat",
    key: "supportChat",
    nameKey: "admin.flagsPage.flagNames.supportChat",
    descriptionKey: "admin.flagsPage.flagDescriptions.supportChat",
    category: "integration",
    status: "stable",
    enabled: false,
  },
  {
    id: "ff-two-factor",
    key: "twoFactor",
    nameKey: "admin.flagsPage.flagNames.twoFactor",
    descriptionKey: "admin.flagsPage.flagDescriptions.twoFactor",
    category: "integration",
    status: "beta",
    enabled: false,
  },
  {
    id: "ff-email-confirm",
    key: "enableEmailConfirmation",
    nameKey: "admin.flagsPage.flagNames.emailConfirm",
    descriptionKey: "admin.flagsPage.flagDescriptions.emailConfirm",
    category: "integration",
    status: "stable",
    enabled: false,
  },
  {
    id: "ff-password-reset",
    key: "enablePasswordReset",
    nameKey: "admin.flagsPage.flagNames.passwordReset",
    descriptionKey: "admin.flagsPage.flagDescriptions.passwordReset",
    category: "integration",
    status: "stable",
    enabled: false,
  },
  {
    id: "ff-plugins",
    key: "enablePlugins",
    nameKey: "admin.flagsPage.flagNames.pluginsCatalog",
    descriptionKey: "admin.flagsPage.flagDescriptions.pluginsCatalog",
    category: "integration",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff-integrations",
    key: "enableIntegrations",
    nameKey: "admin.flagsPage.flagNames.integrations",
    descriptionKey: "admin.flagsPage.flagDescriptions.integrations",
    category: "integration",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff-retention",
    key: "enableRetention",
    nameKey: "admin.flagsPage.flagNames.retentionPolicies",
    descriptionKey: "admin.flagsPage.flagDescriptions.retentionPolicies",
    category: "integration",
    status: "alpha",
    enabled: true,
  },
  {
    id: "ff-limits",
    key: "enableLimits",
    nameKey: "admin.flagsPage.flagNames.rateLimiting",
    descriptionKey: "admin.flagsPage.flagDescriptions.rateLimiting",
    category: "integration",
    status: "alpha",
    enabled: true,
  },
  {
    id: "ff-automation",
    key: "enableAutomation",
    nameKey: "admin.flagsPage.flagNames.automation",
    descriptionKey: "admin.flagsPage.flagDescriptions.automation",
    category: "experimental",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff-analytics",
    key: "enableAnalytics",
    nameKey: "admin.flagsPage.flagNames.teacherAnalytics",
    descriptionKey: "admin.flagsPage.flagDescriptions.teacherAnalytics",
    category: "ui",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff-extensions",
    key: "enableExtensions",
    nameKey: "admin.flagsPage.flagNames.extensionsMgmt",
    descriptionKey: "admin.flagsPage.flagDescriptions.extensionsMgmt",
    category: "ui",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff-announcements",
    key: "enableAnnouncements",
    nameKey: "admin.flagsPage.flagNames.announcements",
    descriptionKey: "admin.flagsPage.flagDescriptions.announcements",
    category: "ui",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff1",
    key: "review_hotkeys",
    nameKey: "admin.flagsPage.flagNames.reviewHotkeys",
    descriptionKey: "admin.flagsPage.flagDescriptions.reviewHotkeys",
    category: "ui",
    status: "stable",
    enabled: true,
  },
  {
    id: "ff2",
    key: "autosave",
    nameKey: "admin.flagsPage.flagNames.autosave",
    descriptionKey: "admin.flagsPage.flagDescriptions.autosave",
    category: "ui",
    status: "stable",
    enabled: true,
  },
  {
    id: "ff3",
    key: "dark_mode",
    nameKey: "admin.flagsPage.flagNames.darkTheme",
    descriptionKey: "admin.flagsPage.flagDescriptions.darkTheme",
    category: "ui",
    status: "beta",
    enabled: false,
  },
  {
    id: "ff4",
    key: "inline_comments",
    nameKey: "admin.flagsPage.flagNames.inlineComments",
    descriptionKey: "admin.flagsPage.flagDescriptions.inlineComments",
    category: "ui",
    status: "alpha",
    enabled: false,
  },
  {
    id: "ff5",
    key: "ai_suggestions",
    nameKey: "admin.flagsPage.flagNames.aiSuggestions",
    descriptionKey: "admin.flagsPage.flagDescriptions.aiSuggestions",
    category: "experimental",
    status: "alpha",
    enabled: false,
  },
  {
    id: "ff6",
    key: "lazy_loading",
    nameKey: "admin.flagsPage.flagNames.lazyLoading",
    descriptionKey: "admin.flagsPage.flagDescriptions.lazyLoading",
    category: "performance",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff7",
    key: "virtual_scrolling",
    nameKey: "admin.flagsPage.flagNames.virtualScrolling",
    descriptionKey: "admin.flagsPage.flagDescriptions.virtualScrolling",
    category: "performance",
    status: "stable",
    enabled: true,
  },
  {
    id: "ff8",
    key: "video_reviews",
    nameKey: "admin.flagsPage.flagNames.videoReviews",
    descriptionKey: "admin.flagsPage.flagDescriptions.videoReviews",
    category: "experimental",
    status: "alpha",
    enabled: false,
  },
  {
    id: "ff9",
    key: "github_sync",
    nameKey: "admin.flagsPage.flagNames.githubSync",
    descriptionKey: "admin.flagsPage.flagDescriptions.githubSync",
    category: "integration",
    status: "beta",
    enabled: false,
  },
  {
    id: "ff10",
    key: "real_time_collab",
    nameKey: "admin.flagsPage.flagNames.realTimeCollab",
    descriptionKey: "admin.flagsPage.flagDescriptions.realTimeCollab",
    category: "experimental",
    status: "alpha",
    enabled: false,
  },
  {
    id: "ff11",
    key: "advanced_analytics",
    nameKey: "admin.flagsPage.flagNames.advancedAnalytics",
    descriptionKey: "admin.flagsPage.flagDescriptions.advancedAnalytics",
    category: "ui",
    status: "beta",
    enabled: true,
  },
  {
    id: "ff12",
    key: "batch_operations",
    nameKey: "admin.flagsPage.flagNames.batchOperations",
    descriptionKey: "admin.flagsPage.flagDescriptions.batchOperations",
    category: "ui",
    status: "stable",
    enabled: true,
  },
];

export default function AdminFlagsPage() {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
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
    const realFlagKeys: string[] = [
      "supportChat",
      "twoFactor",
      "enableEmailConfirmation",
      "enablePasswordReset",
      "enablePlugins",
      "enableIntegrations",
      "enableRetention",
      "enableLimits",
      "enableAutomation",
      "enableAnalytics",
      "enableExtensions",
      "enableAnnouncements",
    ];
    flags.forEach((flag) => {
      if (realFlagKeys.includes(flag.key)) {
        updateRealFlag(flag.key as Parameters<typeof updateRealFlag>[0], flag.enabled);
      }
    });

    logAuditEntry("UPDATE_FEATURE_FLAGS", "FeatureFlags", t("admin.flagsPage.flagsUpdatedAudit"));
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const logAuditEntry = (action: string, resource: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem("admin_audit_logs") || "[]") as Record<
      string,
      unknown
    >[];
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
    const translatedName = t(flag.nameKey).toLowerCase();
    const translatedDesc = t(flag.descriptionKey).toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      translatedName.includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translatedDesc.includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || flag.category === filterCategory;
    const matchesStatus = filterStatus === "all" || flag.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stable":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[11px] font-medium">
            <CheckCircle className="w-3 h-3" />
            {t("admin.flagsPage.statusLabels.stable")}
          </span>
        );
      case "beta":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            Beta
          </span>
        );
      case "alpha":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-brand-primary rounded-[6px] text-[11px] font-medium">
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
      ui: "bg-info-light text-brand-primary",
      performance: "bg-success-light text-success",
      experimental: "bg-accent text-brand-primary",
      integration: "bg-warning-light text-warning",
    };

    const labels: Record<string, string> = {
      ui: "UI",
      performance: t("admin.flagsPage.categoryLabels.performance"),
      experimental: t("admin.flagsPage.categoryLabels.experimental"),
      integration: t("admin.flagsPage.categoryLabels.integration"),
    };

    return (
      <span
        className={`inline-flex px-2 py-1 rounded-[6px] text-[11px] font-medium ${styles[category as keyof typeof styles]}`}
      >
        {labels[category]}
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
    <AppShell title={t("admin.flags.title")}>
      <Breadcrumbs
        items={[CRUMBS.adminSettings, { label: t("admin.settingsCard.featureFlags") }]}
      />

      <PageHeader title={t("admin.flags.title")} subtitle={t("admin.flags.subtitle")} />

      <div>
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-success-light border-2 border-success rounded-[16px] p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Save className="w-4 h-4 text-primary-foreground" />
              </div>
              <p className="text-[14px] font-medium text-success">
                {t("admin.flagsPage.savedSuccess")}
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
              {t("admin.flagsPage.statsTotal")}
            </p>
            <p className="text-[24px] font-medium text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
              {t("admin.flagsPage.statsEnabled")}
            </p>
            <p className="text-[24px] font-medium text-success">{stats.enabled}</p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">Stable</p>
            <p className="text-[24px] font-medium text-success">{stats.stable}</p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">Beta</p>
            <p className="text-[24px] font-medium text-warning">{stats.beta}</p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">Alpha</p>
            <p className="text-[24px] font-medium text-brand-primary">{stats.alpha}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("admin.flagsPage.searchLabel")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("admin.flagsPage.searchPlaceholder")}
                  className="w-full pl-11 pr-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-[200px]">
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("admin.flagsPage.categoryLabel")}
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
              >
                <option value="all">{t("admin.flagsPage.allOption")}</option>
                <option value="ui">UI</option>
                <option value="performance">
                  {t("admin.flagsPage.categoryLabels.performance")}
                </option>
                <option value="experimental">
                  {t("admin.flagsPage.categoryLabels.experimental")}
                </option>
                <option value="integration">
                  {t("admin.flagsPage.categoryLabels.integration")}
                </option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-[200px]">
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("admin.flagsPage.statusLabel")}
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
              >
                <option value="all">{t("admin.flagsPage.allOption")}</option>
                <option value="stable">Stable</option>
                <option value="beta">Beta</option>
                <option value="alpha">Alpha</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(searchQuery || filterCategory !== "all" || filterStatus !== "all") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-border">
              <span className="text-[13px] text-muted-foreground">
                {t("admin.flagsPage.filtersLabel")}
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground rounded-[6px] text-[12px]">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-error">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground rounded-[6px] text-[12px]">
                  {filterCategory}
                  <button onClick={() => setFilterCategory("all")} className="hover:text-error">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground rounded-[6px] text-[12px]">
                  {filterStatus}
                  <button onClick={() => setFilterStatus("all")} className="hover:text-error">
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
                className="bg-card border-2 border-border rounded-[16px] overflow-hidden"
              >
                {/* Main Row */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[16px] font-medium text-foreground">
                          {t(flag.nameKey)}
                        </h3>
                        {getCategoryBadge(flag.category)}
                        {getStatusBadge(flag.status)}
                        {hasOverrides && (
                          <span className="inline-flex px-2 py-1 bg-info-light text-brand-primary rounded-[6px] text-[11px] font-medium">
                            {t("admin.flagsPage.overridesCount_other", {
                              count: Object.keys(flag.tenantOverrides!).length,
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-muted-foreground mb-2">
                        {t(flag.descriptionKey)}
                      </p>
                      <p className="text-[12px] text-muted-foreground font-mono">Key: {flag.key}</p>
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
                        <div className="w-14 h-8 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-card after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-success"></div>
                      </label>

                      {/* Expand Button */}
                      <button
                        onClick={() => setExpandedFlag(isExpanded ? null : flag.id)}
                        className="p-2 hover:bg-muted rounded-[8px] transition-colors"
                      >
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tenant Overrides */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 border-t-2 border-border">
                    <div className="pt-4">
                      <h4 className="text-[14px] font-medium text-foreground mb-3">
                        {t("admin.flagsPage.tenantOverridesTitle")}
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
                              className="flex items-center justify-between p-3 bg-muted rounded-[8px]"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-[14px] text-foreground font-medium">
                                  {tenant.name}
                                </span>
                                {hasOverride ? (
                                  <span className="text-[11px] px-2 py-1 bg-info-light text-brand-primary rounded-[6px] font-medium">
                                    {t("admin.flagsPage.overridden")}
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-muted-foreground">
                                    (
                                    {flag.enabled
                                      ? t("admin.flagsPage.globalEnabled")
                                      : t("admin.flagsPage.globalDisabled")}
                                    )
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
                                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-3">
                        {t("admin.flagsPage.overridesHint")}
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
          <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
            <Flag className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <h3 className="text-[18px] font-medium text-foreground mb-2">
              {t("admin.flagsPage.noFlagsFound")}
            </h3>
            <p className="text-[14px] text-muted-foreground">
              {t("admin.flagsPage.noFlagsFoundHint")}
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-warning-light border-2 border-warning rounded-[16px] p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-foreground mb-1">
                {t("admin.flagsPage.experimentalWarningTitle")}
              </h4>
              <p className="text-[13px] text-muted-foreground">
                {t("admin.flagsPage.experimentalWarningText")}
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
                ? "bg-brand-primary text-primary-foreground hover:bg-brand-primary-hover"
                : "bg-border text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Save className="w-5 h-5" />
            {t("admin.flagsPage.saveChanges")}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
