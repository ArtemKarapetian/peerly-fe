import { Save, EyeOff, Users, Shuffle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherPeerSessionSettingsPage - Настройки peer-сессии
 *
 * Управление параметрами взаимного рецензирования для конкретного задания
 */

interface PeerSessionSettings {
  assignmentId: string;
  anonymityMode: "none" | "hide-student" | "double-anonymous";
  reviewsPerSubmission: number;
  assignmentAlgorithm: "random" | "avoid-collusion";
  allowManualReassignment: boolean;
  autoReassignInactive: boolean;
  inactiveThresholdHours: number;
  lateSubmissionPenaltyEnabled: boolean;
  lateSubmissionPenaltyType: "percentage" | "fixed";
  lateSubmissionPenaltyValue: number;
  studentExtensions: Record<string, number>; // studentId -> hours extended
  updatedAt: Date;
}

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  userId: string;
  userName: string;
}

export default function TeacherPeerSessionSettingsPage() {
  const { assignmentId: routeAssignmentId } = useParams<{ assignmentId: string }>();
  const assignmentId = routeAssignmentId ?? "a1";
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [settings, setSettings] = useState<PeerSessionSettings>(() => {
    const stored = localStorage.getItem(`peer_session_settings_${assignmentId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          updatedAt: new Date(parsed.updatedAt),
        };
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }

    return {
      assignmentId,
      anonymityMode: "double-anonymous",
      reviewsPerSubmission: 3,
      assignmentAlgorithm: "random",
      allowManualReassignment: true,
      autoReassignInactive: true,
      inactiveThresholdHours: 48,
      lateSubmissionPenaltyEnabled: false,
      lateSubmissionPenaltyType: "percentage",
      lateSubmissionPenaltyValue: 10,
      studentExtensions: {},
      updatedAt: new Date(),
    };
  });

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    const stored = localStorage.getItem(`peer_session_audit_${assignmentId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map(
          (entry: {
            action: string;
            field: string;
            oldValue: string;
            newValue: string;
            timestamp: string;
          }) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }),
        );
      } catch (e) {
        console.error("Failed to parse audit log", e);
      }
    }
    return [];
  });

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(`peer_session_settings_${assignmentId}`, JSON.stringify(settings));
  }, [settings, assignmentId]);

  // Save audit log to localStorage
  useEffect(() => {
    localStorage.setItem(`peer_session_audit_${assignmentId}`, JSON.stringify(auditLog));
  }, [auditLog, assignmentId]);

  const addAuditEntry = (action: string, field: string, oldValue: string, newValue: string) => {
    const entry: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date(),
      action,
      field,
      oldValue,
      newValue,
      userId: "u2",
      userName: t("teacher.peerSettings.teacherName"),
    };

    setAuditLog((prev) => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
  };

  const updateSettings = (updates: Partial<PeerSessionSettings>) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        ...updates,
        updatedAt: new Date(),
      };

      // Log changes
      Object.keys(updates).forEach((key) => {
        const oldValue = JSON.stringify(prev[key as keyof PeerSessionSettings] ?? "");
        const newValue = JSON.stringify(updates[key as keyof PeerSessionSettings] ?? "");
        if (oldValue !== newValue) {
          addAuditEntry(t("teacher.peerSettings.settingChange"), key, oldValue, newValue);
        }
      });

      return newSettings;
    });
  };

  const handleSave = () => {
    addAuditEntry(
      t("teacher.peerSettings.settingsSave"),
      "all",
      "",
      t("teacher.peerSettings.settingsSaved"),
    );
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <AppShell title={t("teacher.peerSettings.title")}>
      <Breadcrumbs
        items={[CRUMBS.teacherAssignments, { label: t("teacher.peerSettings.breadcrumb") }]}
      />

      {/* Save Success Banner */}
      {showSaveSuccess && (
        <div className="mt-6 bg-success-light border border-success rounded-[12px] p-4 animate-fade-in">
          <p className="text-[14px] text-foreground font-medium">
            {t("teacher.peerSettings.savedSuccess")}
          </p>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="mt-6 bg-card border-2 border-border rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
              {t("teacher.peerSettings.title")}
            </h1>
            <p className="text-[15px] text-muted-foreground">
              {t("teacher.peerSettings.subtitle")}
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {t("teacher.peerSettings.saveChanges")}
          </button>
        </div>

        <div className="space-y-8">
          {/* Anonymity Mode */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <EyeOff className="w-5 h-5 text-brand-primary" />
              <h2 className="text-[18px] font-medium text-foreground">
                {t("teacher.peerSettings.anonymityMode")}
              </h2>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => updateSettings({ anonymityMode: "none" })}
                className={`
                  w-full p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.anonymityMode === "none"
                      ? "border-brand-primary bg-info-light"
                      : "border-border hover:border-brand-primary-light bg-card"
                  }
                `}
              >
                <div className="text-[15px] font-medium text-foreground mb-1">
                  {t("teacher.peerSettings.noAnonymity")}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {t("teacher.peerSettings.noAnonymityDesc")}
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ anonymityMode: "hide-student" })}
                className={`
                  w-full p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.anonymityMode === "hide-student"
                      ? "border-brand-primary bg-info-light"
                      : "border-border hover:border-brand-primary-light bg-card"
                  }
                `}
              >
                <div className="text-[15px] font-medium text-foreground mb-1">
                  {t("teacher.peerSettings.hideAuthor")}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {t("teacher.peerSettings.hideAuthorDesc")}
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ anonymityMode: "double-anonymous" })}
                className={`
                  w-full p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.anonymityMode === "double-anonymous"
                      ? "border-brand-primary bg-info-light"
                      : "border-border hover:border-brand-primary-light bg-card"
                  }
                `}
              >
                <div className="text-[15px] font-medium text-foreground mb-1">
                  {t("teacher.peerSettings.doubleAnonymous")}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {t("teacher.peerSettings.doubleAnonymousDesc")}
                </div>
              </button>
            </div>
          </div>

          {/* Reviews Per Submission */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-brand-primary" />
              <h2 className="text-[18px] font-medium text-foreground">
                {t("teacher.peerSettings.reviewsPerSubmission")}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={settings.reviewsPerSubmission}
                onChange={(e) =>
                  updateSettings({
                    reviewsPerSubmission: parseInt(e.target.value),
                  })
                }
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.reviewsPerSubmission}
                  onChange={(e) =>
                    updateSettings({
                      reviewsPerSubmission: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-20 px-3 py-2 border-2 border-border rounded-[8px] text-[15px] font-medium text-center focus:outline-none focus:border-brand-primary"
                />
                <span className="text-[14px] text-muted-foreground">
                  {t("teacher.peerSettings.reviewsLabel")}
                </span>
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground mt-2">
              {t("teacher.peerSettings.recommendedRange")}
            </p>
          </div>

          {/* Assignment Algorithm */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shuffle className="w-5 h-5 text-brand-primary" />
              <h2 className="text-[18px] font-medium text-foreground">
                {t("teacher.peerSettings.distributionAlgorithm")}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateSettings({ assignmentAlgorithm: "random" })}
                className={`
                  p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.assignmentAlgorithm === "random"
                      ? "border-brand-primary bg-info-light"
                      : "border-border hover:border-brand-primary-light bg-card"
                  }
                `}
              >
                <div className="text-[15px] font-medium text-foreground mb-1">
                  {t("teacher.peerSettings.randomDistribution")}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {t("teacher.peerSettings.randomDistributionDesc")}
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ assignmentAlgorithm: "avoid-collusion" })}
                className={`
                  p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.assignmentAlgorithm === "avoid-collusion"
                      ? "border-brand-primary bg-info-light"
                      : "border-border hover:border-brand-primary-light bg-card"
                  }
                `}
              >
                <div className="text-[15px] font-medium text-foreground mb-1">
                  {t("teacher.peerSettings.collusionProtection")}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {t("teacher.peerSettings.collusionProtectionDesc")}
                </div>
              </button>
            </div>
            {settings.assignmentAlgorithm === "avoid-collusion" && (
              <div className="mt-3 bg-info-light border border-brand-primary-light rounded-[8px] p-3">
                <p className="text-[13px] text-foreground">
                  <strong>Demo:</strong> {t("teacher.peerSettings.collusionDemoNote")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue in next section... */}
    </AppShell>
  );
}
