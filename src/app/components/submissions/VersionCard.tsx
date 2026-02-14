import {
  Download,
  FileText,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { ValidationCheck } from "@/app/components/submit";

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
  const getStatusInfo = () => {
    switch (version.status) {
      case "draft":
        return {
          label: "Черновик",
          color: "bg-[#e4e4e4]",
          textColor: "text-[#4b4963]",
        };
      case "submitted":
        return {
          label: "Отправлено",
          color: "bg-[#b7bdff]",
          textColor: "text-[#21214f]",
        };
      case "accepted":
        return {
          label: "Принято",
          color: "bg-[#9cf38d]",
          textColor: "text-[#21214f]",
        };
      case "rejected":
        return {
          label: "Отклонено",
          color: "bg-[#ffb8b8]",
          textColor: "text-[#21214f]",
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
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
      className={`bg-white border-2 rounded-[16px] p-4 desktop:p-6 transition-all ${
        comparisonMode && version.selected
          ? "border-[#5b8def] bg-[#f0f5ff]"
          : "border-[#e6e8ee] hover:border-[#d2def8]"
      }`}
    >
      {/* Header: Version + Status + Select (if comparison) */}
      <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-[#e6e8ee]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[20px] font-medium text-[#21214f] tracking-[-0.5px]">
              Версия {version.versionNumber}
              {isLatest && (
                <span className="ml-2 text-[13px] font-normal text-[#5b8def]">(текущая)</span>
              )}
            </h3>
          </div>
          <p className="text-[14px] text-[#767692]">{version.timestamp}</p>
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
                  ? "bg-[#5b8def] border-[#5b8def]"
                  : "bg-white border-[#d2def8] hover:border-[#a0b8f1]"
              }`}
            >
              {version.selected && <CheckCircle className="w-4 h-4 text-white" />}
            </button>
          )}
        </div>
      </div>

      {/* Files */}
      <div className="mb-4">
        <h4 className="text-[14px] font-medium text-[#21214f] mb-2">Файлы</h4>
        <div className="space-y-2">
          {version.files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 text-[13px] text-[#4b4963] bg-[#f9f9f9] rounded-[8px] px-3 py-2"
            >
              <FileText className="w-4 h-4 text-[#767692] shrink-0" />
              <span className="flex-1 min-w-0 truncate">{file.name}</span>
              <span className="text-[#767692] shrink-0">{formatFileSize(file.size)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      {version.note && (
        <div className="mb-4 bg-[#f9f9f9] rounded-[12px] p-3">
          <h4 className="text-[13px] font-medium text-[#767692] mb-1">Комментарий</h4>
          <p className="text-[14px] text-[#21214f] leading-[1.5]">{version.note}</p>
        </div>
      )}

      {/* Validation Checks Summary */}
      {checksSummary && (
        <div className="mb-4">
          <h4 className="text-[14px] font-medium text-[#21214f] mb-2">Проверки</h4>
          <div className="flex items-center gap-3">
            {checksSummary.passed > 0 && (
              <div className="flex items-center gap-1.5 text-[13px]">
                <CheckCircle className="w-4 h-4 text-[#4caf50]" />
                <span className="text-[#4caf50] font-medium">{checksSummary.passed}</span>
              </div>
            )}
            {checksSummary.warnings > 0 && (
              <div className="flex items-center gap-1.5 text-[13px]">
                <AlertCircle className="w-4 h-4 text-[#ff9800]" />
                <span className="text-[#ff9800] font-medium">{checksSummary.warnings}</span>
              </div>
            )}
            {checksSummary.failed > 0 && (
              <div className="flex items-center gap-1.5 text-[13px]">
                <XCircle className="w-4 h-4 text-[#d4183d]" />
                <span className="text-[#d4183d] font-medium">{checksSummary.failed}</span>
              </div>
            )}
            <span className="text-[13px] text-[#767692]">
              ({checksSummary.total} {checksSummary.total === 1 ? "проверка" : "проверок"})
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d2def8] hover:bg-[#c5d5f5] text-[#21214f] rounded-[8px] text-[14px] font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Скачать</span>
        </button>

        <button
          onClick={onViewReports}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-[#e6e8ee] hover:border-[#d2def8] hover:bg-[#f9f9f9] text-[#21214f] rounded-[8px] text-[14px] font-medium transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          <span>Открыть отчёты</span>
        </button>

        {version.status === "draft" && onMakeCurrent && (
          <button
            onClick={onMakeCurrent}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-[#d2def8] hover:border-[#a0b8f1] hover:bg-[#f9f9f9] text-[#21214f] rounded-[8px] text-[14px] font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Сделать текущей</span>
          </button>
        )}

        {isLatest && allowResubmissions && (
          <button
            onClick={onCreateNewVersion}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3d6bc6] hover:bg-[#2d5bb6] text-white rounded-[8px] text-[14px] font-medium transition-colors ml-auto"
          >
            <span>Создать новую версию</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
