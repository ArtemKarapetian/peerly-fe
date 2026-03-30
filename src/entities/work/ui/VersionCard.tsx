import {
  Download,
  FileText,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ValidationCheck } from "@/entities/work/model/types.ts";

/**
 * VersionCard - Карточка версии работы в истории
 *
 * Displays:
 * - Version number + timestamp
 * - Status (draft/submitted/accepted)
 * - File(s) list
 * - Student note/comment
 * - Validation checks summary
 * - Actions: Download, View Reports, Make Current (if draft), New Version
 */

export type VersionStatus = "draft" | "submitted" | "accepted" | "rejected";

export interface Version {
  id: string;
  versionNumber: number; // 1, 2, 3...
  status: VersionStatus;
  timestamp: string; // e.g., "25 января 2026, 14:30"
  files: {
    id: string;
    name: string;
    size: number; // bytes
  }[];
  note?: string; // Student's comment
  validationChecks?: ValidationCheck[];
  selected?: boolean; // For comparison
}

interface VersionCardProps {
  version: Version;
  isLatest: boolean;
  allowResubmissions: boolean;
  onDownload: () => void;
  onViewReports: () => void;
  onMakeCurrent?: () => void; // Only for drafts
  onCreateNewVersion: () => void;
  onToggleSelect?: () => void; // For comparison
  comparisonMode?: boolean;
}

export function VersionCard({
  version,
  isLatest,
  allowResubmissions,
  onDownload,
  onViewReports,
  onMakeCurrent,
  onCreateNewVersion,
  onToggleSelect,
  comparisonMode = false,
}: VersionCardProps) {
  const { t } = useTranslation();

  const getStatusInfo = () => {
    switch (version.status) {
      case "draft":
        return {
          label: t("entity.work.statusDraft"),
          color: "bg-muted",
          textColor: "text-muted-foreground",
        };
      case "submitted":
        return {
          label: t("entity.work.statusSubmitted"),
          color: "bg-info-light",
          textColor: "text-foreground",
        };
      case "accepted":
        return {
          label: t("entity.work.statusAccepted"),
          color: "bg-success-light",
          textColor: "text-foreground",
        };
      case "rejected":
        return {
          label: t("entity.work.statusRejected"),
          color: "bg-error-light",
          textColor: "text-foreground",
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} ${t("entity.work.bytes")}`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${t("entity.work.kb")}`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${t("entity.work.mb")}`;
  };

  // Get checks summary
  const getChecksSummary = () => {
    if (!version.validationChecks || version.validationChecks.length === 0) {
      return null;
    }

    const passed = version.validationChecks.filter((c) => c.status === "passed").length;
    const failed = version.validationChecks.filter((c) => c.status === "failed").length;
    const warnings = version.validationChecks.filter((c) => c.status === "warning").length;

    return { passed, failed, warnings, total: version.validationChecks.length };
  };

  const checksSummary = getChecksSummary();

  return (
    <div
      className={`bg-card border-2 rounded-[16px] p-4 desktop:p-6 transition-all ${
        comparisonMode && version.selected
          ? "border-brand-primary bg-info-light"
          : "border-border hover:border-brand-primary-lighter"
      }`}
    >
      {/* Header: Version + Status + Select (if comparison) */}
      <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[20px] font-medium text-text-primary tracking-[-0.5px]">
              {t("entity.work.version")} {version.versionNumber}
              {isLatest && (
                <span className="ml-2 text-[13px] font-normal text-brand-primary">
                  ({t("entity.work.current")})
                </span>
              )}
            </h3>
          </div>
          <p className="text-[14px] text-text-tertiary">{version.timestamp}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className={`${statusInfo.color} ${statusInfo.textColor} px-3 py-1.5 rounded-[8px]`}>
            <span className="text-[14px] font-medium">{statusInfo.label}</span>
          </div>

          {comparisonMode && (
            <button
              onClick={onToggleSelect}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                version.selected
                  ? "bg-brand-primary border-brand-primary"
                  : "bg-card border-brand-primary-lighter hover:border-brand-primary-light"
              }`}
            >
              {version.selected && <CheckCircle className="w-4 h-4 text-text-inverse" />}
            </button>
          )}
        </div>
      </div>

      {/* Files */}
      <div className="mb-4">
        <h4 className="text-[14px] font-medium text-text-primary mb-2">{t("entity.work.files")}</h4>
        <div className="space-y-2">
          {version.files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 text-[13px] text-text-secondary bg-surface-hover rounded-[8px] px-3 py-2"
            >
              <FileText className="w-4 h-4 text-text-tertiary shrink-0" />
              <span className="flex-1 min-w-0 truncate">{file.name}</span>
              <span className="text-text-tertiary shrink-0">{formatFileSize(file.size)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      {version.note && (
        <div className="mb-4 bg-surface-hover rounded-[12px] p-3">
          <h4 className="text-[13px] font-medium text-text-tertiary mb-1">
            {t("entity.work.comment")}
          </h4>
          <p className="text-[14px] text-text-primary leading-[1.5]">{version.note}</p>
        </div>
      )}

      {/* Validation Checks Summary */}
      {checksSummary && (
        <div className="mb-4">
          <h4 className="text-[14px] font-medium text-text-primary mb-2">
            {t("entity.work.checks")}
          </h4>
          <div className="flex items-center gap-3">
            {checksSummary.passed > 0 && (
              <div className="flex items-center gap-1.5 text-[13px]">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-success font-medium">{checksSummary.passed}</span>
              </div>
            )}
            {checksSummary.warnings > 0 && (
              <div className="flex items-center gap-1.5 text-[13px]">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-warning font-medium">{checksSummary.warnings}</span>
              </div>
            )}
            {checksSummary.failed > 0 && (
              <div className="flex items-center gap-1.5 text-[13px]">
                <XCircle className="w-4 h-4 text-error" />
                <span className="text-error font-medium">{checksSummary.failed}</span>
              </div>
            )}
            <span className="text-[13px] text-text-tertiary">
              ({checksSummary.total}{" "}
              {checksSummary.total === 1 ? t("entity.work.checkOne") : t("entity.work.checkMany")})
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary-lighter hover:bg-info-light text-text-primary rounded-[8px] text-[14px] font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{t("common.download")}</span>
        </button>

        <button
          onClick={onViewReports}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-card border-2 border-border hover:border-brand-primary-lighter hover:bg-surface-hover text-text-primary rounded-[8px] text-[14px] font-medium transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          <span>{t("entity.work.openReports")}</span>
        </button>

        {version.status === "draft" && onMakeCurrent && (
          <button
            onClick={onMakeCurrent}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-card border-2 border-brand-primary-lighter hover:border-brand-primary-light hover:bg-surface-hover text-text-primary rounded-[8px] text-[14px] font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t("entity.work.makeCurrent")}</span>
          </button>
        )}

        {isLatest && allowResubmissions && (
          <button
            onClick={onCreateNewVersion}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-text-inverse rounded-[8px] text-[14px] font-medium transition-colors ml-auto"
          >
            <span>{t("entity.work.createNewVersion")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
