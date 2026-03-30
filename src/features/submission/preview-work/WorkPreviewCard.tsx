import { AlertCircle, CheckCircle, Download, ExternalLink, FileText, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ValidationCheck, WorkFile } from "@/entities/work/model/types.ts";

interface WorkPreviewCardProps {
  files: WorkFile[];
  validationChecks?: ValidationCheck[];
  onDownloadFile: (fileId: string) => void;
  onOpenInNewWindow?: () => void;
}

/**
 * WorkPreviewCard - Превью проверяемой работы
 *
 * Displays:
 * - File list with download buttons
 * - "Открыть в новом окне" link
 * - Validation checks summary
 */

export function WorkPreviewCard({
  files,
  validationChecks = [],
  onDownloadFile,
  onOpenInNewWindow,
}: WorkPreviewCardProps) {
  const { t } = useTranslation();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} ${t("entity.work.bytes")}`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${t("entity.work.kb")}`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${t("entity.work.mb")}`;
  };

  // Get checks summary
  const getChecksSummary = () => {
    if (validationChecks.length === 0) return null;

    const passed = validationChecks.filter((c) => c.status === "passed").length;
    const failed = validationChecks.filter((c) => c.status === "failed").length;
    const warnings = validationChecks.filter((c) => c.status === "warning").length;

    return { passed, failed, warnings, total: validationChecks.length };
  };

  const checksSummary = getChecksSummary();

  return (
    <div className="bg-card border-2 border-border rounded-[16px] p-4 desktop:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <h3 className="text-[18px] desktop:text-[20px] font-medium text-foreground tracking-[-0.5px]">
          {t("feature.workPreview.title")}
        </h3>
        {onOpenInNewWindow && (
          <button
            onClick={onOpenInNewWindow}
            className="inline-flex items-center gap-1.5 text-[13px] text-brand-primary hover:text-brand-primary transition-colors"
          >
            <span>{t("feature.workPreview.openInNewWindow")}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Files */}
      <div className="mb-4">
        <h4 className="text-[14px] font-medium text-foreground mb-2">
          {t("feature.workPreview.files")} ({files.length})
        </h4>
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 bg-muted rounded-[8px] px-3 py-2.5"
            >
              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-foreground truncate">{file.name}</p>
                <p className="text-[12px] text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => onDownloadFile(file.id)}
                className="p-2 hover:bg-surface-hover rounded-[8px] transition-colors"
                aria-label={t("feature.workPreview.downloadFile")}
              >
                <Download className="w-4 h-4 text-brand-primary" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Checks */}
      {checksSummary && (
        <div>
          <h4 className="text-[14px] font-medium text-foreground mb-2">
            {t("feature.workPreview.checks")}
          </h4>
          <div className="bg-muted rounded-[12px] p-3">
            <div className="flex items-center gap-4 flex-wrap">
              {checksSummary.passed > 0 && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-[13px] text-success font-medium">
                    {checksSummary.passed} {t("feature.workPreview.passed")}
                  </span>
                </div>
              )}
              {checksSummary.warnings > 0 && (
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <span className="text-[13px] text-warning font-medium">
                    {checksSummary.warnings} {t("feature.workPreview.warnings")}
                  </span>
                </div>
              )}
              {checksSummary.failed > 0 && (
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span className="text-[13px] text-destructive font-medium">
                    {checksSummary.failed} {t("feature.workPreview.failed")}
                  </span>
                </div>
              )}
            </div>

            {/* Detailed checks */}
            <div className="mt-3 space-y-2">
              {validationChecks.map((check) => (
                <div key={check.id} className="flex items-start gap-2 text-[13px]">
                  {check.status === "passed" && (
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  )}
                  {check.status === "warning" && (
                    <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  )}
                  {check.status === "failed" && (
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium">{check.name}</p>
                    {check.message && (
                      <p className="text-muted-foreground mt-0.5">{check.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
