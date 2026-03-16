import { Save, Plus, X, Building, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminLimitsPage - Limits & quotas
 */

interface GlobalLimits {
  maxUploadSizeMB: number;
  maxFilesPerSubmission: number;
  maxSubmissionAttempts: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  maxReviewsPerDay: number;
  maxCoursesPerTeacher: number;
}

interface TenantOverride {
  tenantId: string;
  tenantName: string;
  limits: Partial<GlobalLimits>;
}

const DEFAULT_LIMITS: GlobalLimits = {
  maxUploadSizeMB: 10,
  maxFilesPerSubmission: 5,
  maxSubmissionAttempts: 3,
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
  },
  maxReviewsPerDay: 50,
  maxCoursesPerTeacher: 20,
};

const getInitialLimits = (): GlobalLimits => {
  const stored = localStorage.getItem("admin_global_limits");
  return stored ? JSON.parse(stored) : DEFAULT_LIMITS;
};

const getInitialOverrides = (): TenantOverride[] => {
  const stored = localStorage.getItem("admin_tenant_overrides");
  return stored ? JSON.parse(stored) : [];
};

export default function AdminLimitsPage() {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [globalLimits, setGlobalLimits] = useState<GlobalLimits>(getInitialLimits);
  const [tenantOverrides, setTenantOverrides] = useState<TenantOverride[]>(getInitialOverrides);
  const [showAddOverride, setShowAddOverride] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const availableTenants = [
    { id: "org1", name: "HSE" },
    { id: "org2", name: "MGUSiT" },
    { id: "org3", name: "Demo University" },
  ];

  const handleGlobalChange = (path: string, value: string) => {
    const numValue = parseInt(value) || 0;
    if (path.includes(".")) {
      const [parent, child] = path.split(".");
      setGlobalLimits({
        ...globalLimits,
        [parent]: {
          ...(globalLimits[parent as keyof GlobalLimits] as Record<string, number>),
          [child]: numValue,
        },
      });
    } else {
      setGlobalLimits({ ...globalLimits, [path]: numValue });
    }
    setHasChanges(true);
  };

  const handleAddOverride = () => {
    const unusedTenant = availableTenants.find(
      (t) => !tenantOverrides.some((o) => o.tenantId === t.id),
    );
    if (!unusedTenant) {
      alert(t("admin.limitsPage.allOrgsHaveOverrides"));
      return;
    }
    const newOverride: TenantOverride = {
      tenantId: unusedTenant.id,
      tenantName: unusedTenant.name,
      limits: {},
    };
    setTenantOverrides([...tenantOverrides, newOverride]);
    setHasChanges(true);
    setShowAddOverride(false);
  };

  const handleRemoveOverride = (tenantId: string) => {
    if (!confirm(t("admin.limitsPage.confirmRemoveOverride"))) return;
    setTenantOverrides(tenantOverrides.filter((o) => o.tenantId !== tenantId));
    setHasChanges(true);
  };

  const handleOverrideChange = (tenantId: string, key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setTenantOverrides(
      tenantOverrides.map((override) => {
        if (override.tenantId !== tenantId) return override;
        return { ...override, limits: { ...override.limits, [key]: numValue } };
      }),
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem("admin_global_limits", JSON.stringify(globalLimits));
    localStorage.setItem("admin_tenant_overrides", JSON.stringify(tenantOverrides));
    logAuditEntry("UPDATE_LIMITS", "SystemLimits", t("admin.limitsPage.auditUpdated"));
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const logAuditEntry = (action: string, resource: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem("admin_audit_logs") || "[]");
    logs.unshift({
      id: `audit-${Date.now()}`,
      userId: "limits-system",
      adminId: "u3",
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("admin_audit_logs", JSON.stringify(logs));
  };

  const limitSettings = [
    {
      key: "maxUploadSizeMB",
      labelKey: "admin.limitsPage.maxUploadSize",
      descriptionKey: "admin.limitsPage.maxUploadSizeDesc",
      unit: "MB",
      icon: "📁",
    },
    {
      key: "maxFilesPerSubmission",
      labelKey: "admin.limitsPage.filesPerSubmission",
      descriptionKey: "admin.limitsPage.filesPerSubmissionDesc",
      unitKey: "admin.limitsPage.unitFiles",
      icon: "📎",
    },
    {
      key: "maxSubmissionAttempts",
      labelKey: "admin.limitsPage.submissionAttempts",
      descriptionKey: "admin.limitsPage.submissionAttemptsDesc",
      unitKey: "admin.limitsPage.unitAttempts",
      icon: "🔄",
    },
    {
      key: "maxReviewsPerDay",
      labelKey: "admin.limitsPage.reviewsPerDay",
      descriptionKey: "admin.limitsPage.reviewsPerDayDesc",
      unitKey: "admin.limitsPage.unitReviews",
      icon: "✍️",
    },
    {
      key: "maxCoursesPerTeacher",
      labelKey: "admin.limitsPage.coursesPerTeacher",
      descriptionKey: "admin.limitsPage.coursesPerTeacherDesc",
      unitKey: "admin.limitsPage.unitCourses",
      icon: "📚",
    },
  ];

  return (
    <AppShell title={t("admin.limits.title")}>
      <Breadcrumbs items={[CRUMBS.adminSettings, { label: t("admin.limits.title") }]} />
      <PageHeader title={t("admin.limits.title")} subtitle={t("admin.limits.subtitle")} />

      <div>
        {showSuccess && (
          <div className="bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[16px] p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4caf50] rounded-full flex items-center justify-center">
                <Save className="w-4 h-4 text-white" />
              </div>
              <p className="text-[14px] font-medium text-[#4caf50]">
                {t("admin.limitsPage.savedSuccess")}
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-[20px] font-medium text-[#21214f] mb-4">
            {t("admin.limitsPage.globalLimits")}
          </h2>
          <div className="space-y-4">
            {limitSettings.map((setting) => (
              <div
                key={setting.key}
                className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="text-[32px] flex-shrink-0">{setting.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                      {t(setting.labelKey)}
                    </h3>
                    <p className="text-[13px] text-[#767692] mb-3">{t(setting.descriptionKey)}</p>
                    <div className="flex items-center gap-2 max-w-[250px]">
                      <input
                        type="number"
                        min="1"
                        value={globalLimits[setting.key as keyof GlobalLimits] as number}
                        onChange={(e) => handleGlobalChange(setting.key, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:border-[#5b8def] focus:outline-none transition-colors"
                      />
                      <span className="text-[14px] text-[#767692] min-w-[80px]">
                        {setting.unit || t(setting.unitKey!)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Rate Limits */}
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6">
              <div className="flex items-start gap-4">
                <div className="text-[32px] flex-shrink-0">⚡</div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                    {t("admin.limitsPage.rateLimiting")}
                  </h3>
                  <p className="text-[13px] text-[#767692] mb-4">
                    {t("admin.limitsPage.rateLimitingDesc")}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                        {t("admin.limitsPage.requestsPerMinute")}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={globalLimits.rateLimit.requestsPerMinute}
                          onChange={(e) =>
                            handleGlobalChange("rateLimit.requestsPerMinute", e.target.value)
                          }
                          className="flex-1 px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:border-[#5b8def] focus:outline-none transition-colors"
                        />
                        <span className="text-[14px] text-[#767692] min-w-[60px]">req/min</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                        {t("admin.limitsPage.requestsPerHour")}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={globalLimits.rateLimit.requestsPerHour}
                          onChange={(e) =>
                            handleGlobalChange("rateLimit.requestsPerHour", e.target.value)
                          }
                          className="flex-1 px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:border-[#5b8def] focus:outline-none transition-colors"
                        />
                        <span className="text-[14px] text-[#767692] min-w-[60px]">req/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Overrides */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[20px] font-medium text-[#21214f]">
                {t("admin.limitsPage.tenantOverrides")}
              </h2>
              <p className="text-[13px] text-[#767692] mt-1">
                {t("admin.limitsPage.tenantOverridesDesc")}
              </p>
            </div>
            {tenantOverrides.length < availableTenants.length && (
              <button
                onClick={() => setShowAddOverride(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
              >
                <Plus className="w-4 h-4" />
                {t("admin.limitsPage.addBtn")}
              </button>
            )}
          </div>

          {tenantOverrides.length > 0 ? (
            <div className="space-y-4">
              {tenantOverrides.map((override) => {
                const tenant = availableTenants.find((t) => t.id === override.tenantId);
                return (
                  <div
                    key={override.tenantId}
                    className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6"
                  >
                    <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-[#e6e8ee]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#e9f5ff] rounded-[8px] flex items-center justify-center">
                          <Building className="w-5 h-5 text-[#5b8def]" />
                        </div>
                        <div>
                          <h3 className="text-[16px] font-medium text-[#21214f]">{tenant?.name}</h3>
                          <p className="text-[12px] text-[#767692]">ID: {override.tenantId}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveOverride(override.tenantId)}
                        className="p-2 text-[#d4183d] hover:bg-[#fff5f5] rounded-[8px] transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {limitSettings.map((setting) => (
                        <div key={setting.key}>
                          <label className="block text-[12px] font-medium text-[#767692] mb-2">
                            {t(setting.labelKey)}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={
                                (override.limits[setting.key as keyof GlobalLimits] as number) || ""
                              }
                              onChange={(e) =>
                                handleOverrideChange(override.tenantId, setting.key, e.target.value)
                              }
                              placeholder={t("admin.limitsPage.defaultPlaceholder", {
                                value: globalLimits[setting.key as keyof GlobalLimits],
                              })}
                              className="flex-1 px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[13px] focus:border-[#5b8def] focus:outline-none transition-colors"
                            />
                            <span className="text-[12px] text-[#767692] min-w-[60px]">
                              {setting.unit || t(setting.unitKey!)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-[#f9f9f9] rounded-[8px]">
                      <p className="text-[12px] text-[#767692]">
                        {t("admin.limitsPage.overrideHint")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-12 text-center">
              <Building className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <h3 className="text-[16px] font-medium text-[#21214f] mb-2">
                {t("admin.limitsPage.noOverrides")}
              </h3>
              <p className="text-[13px] text-[#767692] mb-4">
                {t("admin.limitsPage.noOverridesDesc")}
              </p>
            </div>
          )}
        </div>

        <div className="bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#5b8def] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">
                {t("admin.limitsPage.aboutLimitsTitle")}
              </h4>
              <p className="text-[13px] text-[#767692]">{t("admin.limitsPage.aboutLimitsText")}</p>
            </div>
          </div>
        </div>

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
            {t("admin.limitsPage.saveChanges")}
          </button>
        </div>
      </div>

      {showAddOverride && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddOverride(false)}
        >
          <div
            className="bg-white rounded-[20px] w-full max-w-[500px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b-2 border-[#e6e8ee]">
              <h2 className="text-[18px] font-medium text-[#21214f]">
                {t("admin.limitsPage.addOverrideTitle")}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-[#767692] mb-4">
                {t("admin.limitsPage.addOverrideText")}
              </p>
              <div className="p-4 bg-[#f9f9f9] rounded-[12px] border-2 border-[#e6e8ee]">
                <p className="text-[13px] text-[#21214f]">
                  {t("admin.limitsPage.availableOrgs")}{" "}
                  <strong>
                    {availableTenants
                      .filter((t) => !tenantOverrides.some((o) => o.tenantId === t.id))
                      .map((t) => t.name)
                      .join(", ")}
                  </strong>
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t-2 border-[#e6e8ee] flex gap-3">
              <button
                onClick={() => setShowAddOverride(false)}
                className="flex-1 px-4 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[14px] font-medium"
              >
                {t("admin.limitsPage.cancel")}
              </button>
              <button
                onClick={handleAddOverride}
                className="flex-1 px-4 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
              >
                {t("admin.limitsPage.add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
