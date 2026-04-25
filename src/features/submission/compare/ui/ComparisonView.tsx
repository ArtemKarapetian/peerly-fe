import { X, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Version } from "@/entities/work";

/**
 * ComparisonView - Side-by-side metadata comparison of two versions
 *
 * Displays:
 * - Two versions side by side
 * - Metadata comparison (status, timestamp, files, note, checks)
 * - Highlight differences
 */

interface ComparisonViewProps {
  version1: Version;
  version2: Version;
  onClose: () => void;
}

export function ComparisonView({ version1, version2, onClose }: ComparisonViewProps) {
  const { t } = useTranslation();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} ${t("entity.work.bytes")}`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${t("entity.work.kb")}`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${t("entity.work.mb")}`;
  };

  const getStatusLabel = (status: Version["status"]) => {
    switch (status) {
      case "draft":
        return t("entity.work.statusDraft");
      case "submitted":
        return t("entity.work.statusSubmitted");
      case "accepted":
        return t("entity.work.statusAccepted");
      case "rejected":
        return t("entity.work.statusRejected");
    }
  };

  const getChecksSummary = (version: Version) => {
    if (!version.validationChecks || version.validationChecks.length === 0) {
      return { passed: 0, failed: 0, warnings: 0, total: 0 };
    }

    const passed = version.validationChecks.filter((c) => c.status === "passed").length;
    const failed = version.validationChecks.filter((c) => c.status === "failed").length;
    const warnings = version.validationChecks.filter((c) => c.status === "warning").length;

    return { passed, failed, warnings, total: version.validationChecks.length };
  };

  const checks1 = getChecksSummary(version1);
  const checks2 = getChecksSummary(version2);

  return (
    <div className="bg-card border-2 border-brand-primary rounded-[20px] p-6 mb-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h3 className="text-[20px] font-medium text-foreground tracking-[-0.5px]">
          {t("feature.comparison.title")}
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-[8px] transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <div>
          <div className="bg-brand-primary-light rounded-[12px] p-4 mb-4">
            <h4 className="text-[18px] font-medium text-foreground mb-1">
              {t("entity.work.version")} {version1.versionNumber}
            </h4>
            <p className="text-[13px] text-muted-foreground">{version1.timestamp}</p>
          </div>

          <div className="mb-4">
            <div className="text-[13px] text-muted-foreground mb-1">
              {t("feature.comparison.status")}
            </div>
            <div className="text-[15px] font-medium text-foreground">
              {getStatusLabel(version1.status)}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[13px] text-muted-foreground mb-2">
              {t("feature.comparison.files")} ({version1.files.length})
            </div>
            <div className="space-y-1">
              {version1.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 text-[13px] text-muted-foreground bg-muted rounded-[8px] px-3 py-2"
                >
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 min-w-0 truncate">{file.name}</span>
                  <span className="text-muted-foreground shrink-0">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[13px] text-muted-foreground mb-1">
              {t("feature.comparison.comment")}
            </div>
            <div className="text-[14px] text-foreground bg-muted rounded-[8px] p-3 min-h-[60px]">
              {version1.note || (
                <span className="text-muted-foreground italic">
                  {t("feature.comparison.noComment")}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-[13px] text-muted-foreground mb-2">
              {t("feature.comparison.checks")}
            </div>
            <div className="flex items-center gap-3 bg-muted rounded-[8px] p-3">
              {checks1.total === 0 ? (
                <span className="text-[13px] text-muted-foreground italic">
                  {t("feature.comparison.noChecks")}
                </span>
              ) : (
                <>
                  {checks1.passed > 0 && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-[13px] text-success font-medium">{checks1.passed}</span>
                    </div>
                  )}
                  {checks1.warnings > 0 && (
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-warning" />
                      <span className="text-[13px] text-warning font-medium">
                        {checks1.warnings}
                      </span>
                    </div>
                  )}
                  {checks1.failed > 0 && (
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="text-[13px] text-destructive font-medium">
                        {checks1.failed}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-brand-primary-light rounded-[12px] p-4 mb-4">
            <h4 className="text-[18px] font-medium text-foreground mb-1">
              {t("entity.work.version")} {version2.versionNumber}
            </h4>
            <p className="text-[13px] text-muted-foreground">{version2.timestamp}</p>
          </div>

          <div className="mb-4">
            <div className="text-[13px] text-muted-foreground mb-1">
              {t("feature.comparison.status")}
            </div>
            <div
              className={`text-[15px] font-medium ${
                version1.status !== version2.status ? "text-brand-primary" : "text-foreground"
              }`}
            >
              {getStatusLabel(version2.status)}
              {version1.status !== version2.status && <span className="ml-1">✓</span>}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[13px] text-muted-foreground mb-2">
              {t("feature.comparison.files")} ({version2.files.length})
              {version1.files.length !== version2.files.length && (
                <span className="ml-1 text-brand-primary">✓</span>
              )}
            </div>
            <div className="space-y-1">
              {version2.files.map((file) => {
                const isDifferent = !version1.files.some((f) => f.name === file.name);
                return (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 text-[13px] rounded-[8px] px-3 py-2 ${
                      isDifferent
                        ? "bg-brand-primary-light text-foreground border border-brand-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 min-w-0 truncate">{file.name}</span>
                    <span className="text-muted-foreground shrink-0">
                      {formatFileSize(file.size)}
                    </span>
                    {isDifferent && <span className="text-brand-primary">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[13px] text-muted-foreground mb-1">
              {t("feature.comparison.comment")}
              {version1.note !== version2.note && (
                <span className="ml-1 text-brand-primary">✓</span>
              )}
            </div>
            <div
              className={`text-[14px] rounded-[8px] p-3 min-h-[60px] ${
                version1.note !== version2.note
                  ? "bg-brand-primary-light text-foreground border border-brand-primary"
                  : "bg-muted text-foreground"
              }`}
            >
              {version2.note || (
                <span className="text-muted-foreground italic">
                  {t("feature.comparison.noComment")}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-[13px] text-muted-foreground mb-2">
              {t("feature.comparison.checks")}
              {(checks1.passed !== checks2.passed ||
                checks1.failed !== checks2.failed ||
                checks1.warnings !== checks2.warnings) && (
                <span className="ml-1 text-brand-primary">✓</span>
              )}
            </div>
            <div
              className={`flex items-center gap-3 rounded-[8px] p-3 ${
                checks1.passed !== checks2.passed ||
                checks1.failed !== checks2.failed ||
                checks1.warnings !== checks2.warnings
                  ? "bg-brand-primary-light border border-brand-primary"
                  : "bg-muted"
              }`}
            >
              {checks2.total === 0 ? (
                <span className="text-[13px] text-muted-foreground italic">
                  {t("feature.comparison.noChecks")}
                </span>
              ) : (
                <>
                  {checks2.passed > 0 && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-[13px] text-success font-medium">{checks2.passed}</span>
                    </div>
                  )}
                  {checks2.warnings > 0 && (
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-warning" />
                      <span className="text-[13px] text-warning font-medium">
                        {checks2.warnings}
                      </span>
                    </div>
                  )}
                  {checks2.failed > 0 && (
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="text-[13px] text-destructive font-medium">
                        {checks2.failed}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-[13px] text-muted-foreground flex items-center gap-1">
          <span className="text-brand-primary">✓</span>
          <span>{t("feature.comparison.changesLegend")}</span>
        </p>
      </div>
    </div>
  );
}
