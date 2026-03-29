import { Database, AlertTriangle, Clock, Save, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminRetentionPage - Data retention policies
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

const getInitialPolicy = (): RetentionPolicy => {
  const stored = localStorage.getItem("admin_retention_policy");
  return stored ? JSON.parse(stored) : DEFAULT_RETENTION;
};

export default function AdminRetentionPage() {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
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
    logAuditEntry(
      "UPDATE_RETENTION_POLICY",
      "RetentionPolicy",
      t("admin.retentionPage.auditUpdated"),
    );
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (!confirm(t("admin.retentionPage.confirmReset"))) return;
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
      labelKey: "admin.retentionPage.submissions",
      descriptionKey: "admin.retentionPage.submissionsDesc",
      icon: "📄",
      warningKey: "admin.retentionPage.submissionsWarning",
    },
    {
      key: "logs" as keyof RetentionPolicy,
      labelKey: "admin.retentionPage.systemLogs",
      descriptionKey: "admin.retentionPage.systemLogsDesc",
      icon: "📋",
      warningKey: "admin.retentionPage.systemLogsWarning",
    },
    {
      key: "pluginReports" as keyof RetentionPolicy,
      labelKey: "admin.retentionPage.pluginReports",
      descriptionKey: "admin.retentionPage.pluginReportsDesc",
      icon: "🔌",
      warningKey: "admin.retentionPage.pluginReportsWarning",
    },
    {
      key: "archivedCourses" as keyof RetentionPolicy,
      labelKey: "admin.retentionPage.archivedCourses",
      descriptionKey: "admin.retentionPage.archivedCoursesDesc",
      icon: "📦",
      warningKey: "admin.retentionPage.archivedCoursesWarning",
    },
    {
      key: "userSessions" as keyof RetentionPolicy,
      labelKey: "admin.retentionPage.userSessions",
      descriptionKey: "admin.retentionPage.userSessionsDesc",
      icon: "🔐",
      warningKey: "admin.retentionPage.userSessionsWarning",
    },
  ];

  const hasAnyRiskySettings = retentionSettings.some((setting) =>
    isRisky(setting.key, policy[setting.key]),
  );

  return (
    <AppShell title={t("admin.retention.title")}>
      <Breadcrumbs items={[CRUMBS.adminSettings, { label: t("admin.retention.title") }]} />
      <PageHeader title={t("admin.retention.title")} subtitle={t("admin.retention.subtitle")} />

      <div>
        {hasAnyRiskySettings && (
          <div className="bg-[#fff5f5] border-2 border-[#d4183d] rounded-[16px] p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-[#d4183d] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14px] font-medium text-[#d4183d] mb-1">
                  {t("admin.retentionPage.riskySettingsTitle")}
                </h4>
                <p className="text-[13px] text-[#767692]">
                  {t("admin.retentionPage.riskySettingsText")}
                </p>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[16px] p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4caf50] rounded-full flex items-center justify-center">
                <Save className="w-4 h-4 text-white" />
              </div>
              <p className="text-[14px] font-medium text-[#4caf50]">
                {t("admin.retentionPage.savedSuccess")}
              </p>
            </div>
          </div>
        )}

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
                  <div className="text-[32px] flex-shrink-0">{setting.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-[18px] font-medium text-[#21214f] mb-1">
                      {t(setting.labelKey)}
                    </h3>
                    <p className="text-[13px] text-[#767692] mb-4">{t(setting.descriptionKey)}</p>

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
                        <span className="text-[14px] text-[#767692] min-w-[60px]">
                          {t("admin.retentionPage.daysUnit")}
                        </span>
                      </div>

                      <div className="text-[12px] text-[#767692]">
                        {value === 0 ? (
                          <span className="inline-flex px-2 py-1 bg-[#f5f5f5] rounded-[6px]">
                            {t("admin.retentionPage.disabled")}
                          </span>
                        ) : value < 30 ? (
                          <span className="text-[#d4183d]">
                            {t("admin.retentionPage.weeksApprox", {
                              value: Math.floor(value / 7),
                            })}
                          </span>
                        ) : value < 365 ? (
                          <span>
                            {t("admin.retentionPage.monthsApprox", {
                              value: Math.floor(value / 30),
                            })}
                          </span>
                        ) : (
                          <span>
                            {t("admin.retentionPage.yearsApprox", {
                              value: Math.floor(value / 365),
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    {risky && (
                      <div className="flex items-start gap-2 p-3 bg-[#fff5f5] rounded-[8px]">
                        <AlertTriangle className="w-4 h-4 text-[#d4183d] flex-shrink-0 mt-0.5" />
                        <p className="text-[12px] text-[#d4183d]">
                          <strong>{t("admin.retentionPage.warningPrefix")}</strong>{" "}
                          {t(setting.warningKey)}
                        </p>
                      </div>
                    )}

                    {!risky && value < DEFAULT_RETENTION[setting.key] && (
                      <div className="flex items-start gap-2 p-3 bg-[#fff4e5] rounded-[8px]">
                        <AlertTriangle className="w-4 h-4 text-[#ff9800] flex-shrink-0 mt-0.5" />
                        <p className="text-[12px] text-[#767692]">
                          {t("admin.retentionPage.recommendedValue")}{" "}
                          <strong>
                            {t("admin.retentionPage.recommendedDays", {
                              value: DEFAULT_RETENTION[setting.key],
                            })}
                          </strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4 mb-6">
          <div className="flex gap-3">
            <Database className="w-5 h-5 text-[#5b8def] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">
                {t("admin.retentionPage.aboutRetentionTitle")}
              </h4>
              <p className="text-[13px] text-[#767692] mb-2">
                {t("admin.retentionPage.aboutRetentionText1")}
              </p>
              <p className="text-[13px] text-[#767692]">
                {t("admin.retentionPage.aboutRetentionText2")}
              </p>
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
            {t("admin.retentionPage.saveChanges")}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[14px] font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            {t("admin.retentionPage.resetToDefaults")}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
