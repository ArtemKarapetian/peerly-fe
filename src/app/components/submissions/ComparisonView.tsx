import { X, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { Version } from "./VersionCard";

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
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  };

  const getStatusLabel = (status: Version["status"]) => {
    switch (status) {
      case "draft":
        return "Черновик";
      case "submitted":
        return "Отправлено";
      case "accepted":
        return "Принято";
      case "rejected":
        return "Отклонено";
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
    <div className="bg-white border-2 border-[#5b8def] rounded-[20px] p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e6e8ee]">
        <h3 className="text-[20px] font-medium text-[#21214f] tracking-[-0.5px]">
          Сравнение версий
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors"
        >
          <X className="w-5 h-5 text-[#767692]" />
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        {/* Version 1 */}
        <div>
          <div className="bg-[#f0f5ff] rounded-[12px] p-4 mb-4">
            <h4 className="text-[18px] font-medium text-[#21214f] mb-1">
              Версия {version1.versionNumber}
            </h4>
            <p className="text-[13px] text-[#767692]">{version1.timestamp}</p>
          </div>

          {/* Status */}
          <div className="mb-4">
            <div className="text-[13px] text-[#767692] mb-1">Статус</div>
            <div className="text-[15px] font-medium text-[#21214f]">
              {getStatusLabel(version1.status)}
            </div>
          </div>

          {/* Files */}
          <div className="mb-4">
            <div className="text-[13px] text-[#767692] mb-2">Файлы ({version1.files.length})</div>
            <div className="space-y-1">
              {version1.files.map((file) => (
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
          <div className="mb-4">
            <div className="text-[13px] text-[#767692] mb-1">Комментарий</div>
            <div className="text-[14px] text-[#21214f] bg-[#f9f9f9] rounded-[8px] p-3 min-h-[60px]">
              {version1.note || <span className="text-[#767692] italic">Нет комментария</span>}
            </div>
          </div>

          {/* Checks */}
          <div>
            <div className="text-[13px] text-[#767692] mb-2">Проверки</div>
            <div className="flex items-center gap-3 bg-[#f9f9f9] rounded-[8px] p-3">
              {checks1.total === 0 ? (
                <span className="text-[13px] text-[#767692] italic">Нет проверок</span>
              ) : (
                <>
                  {checks1.passed > 0 && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#4caf50]" />
                      <span className="text-[13px] text-[#4caf50] font-medium">
                        {checks1.passed}
                      </span>
                    </div>
                  )}
                  {checks1.warnings > 0 && (
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#ff9800]" />
                      <span className="text-[13px] text-[#ff9800] font-medium">
                        {checks1.warnings}
                      </span>
                    </div>
                  )}
                  {checks1.failed > 0 && (
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-[#d4183d]" />
                      <span className="text-[13px] text-[#d4183d] font-medium">
                        {checks1.failed}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Version 2 */}
        <div>
          <div className="bg-[#f0f5ff] rounded-[12px] p-4 mb-4">
            <h4 className="text-[18px] font-medium text-[#21214f] mb-1">
              Версия {version2.versionNumber}
            </h4>
            <p className="text-[13px] text-[#767692]">{version2.timestamp}</p>
          </div>

          {/* Status */}
          <div className="mb-4">
            <div className="text-[13px] text-[#767692] mb-1">Статус</div>
            <div
              className={`text-[15px] font-medium ${
                version1.status !== version2.status ? "text-[#5b8def]" : "text-[#21214f]"
              }`}
            >
              {getStatusLabel(version2.status)}
              {version1.status !== version2.status && <span className="ml-1">✓</span>}
            </div>
          </div>

          {/* Files */}
          <div className="mb-4">
            <div className="text-[13px] text-[#767692] mb-2">
              Файлы ({version2.files.length})
              {version1.files.length !== version2.files.length && (
                <span className="ml-1 text-[#5b8def]">✓</span>
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
                        ? "bg-[#f0f5ff] text-[#21214f] border border-[#d2e1f8]"
                        : "bg-[#f9f9f9] text-[#4b4963]"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-[#767692] shrink-0" />
                    <span className="flex-1 min-w-0 truncate">{file.name}</span>
                    <span className="text-[#767692] shrink-0">{formatFileSize(file.size)}</span>
                    {isDifferent && <span className="text-[#5b8def]">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div className="mb-4">
            <div className="text-[13px] text-[#767692] mb-1">
              Комментарий
              {version1.note !== version2.note && <span className="ml-1 text-[#5b8def]">✓</span>}
            </div>
            <div
              className={`text-[14px] rounded-[8px] p-3 min-h-[60px] ${
                version1.note !== version2.note
                  ? "bg-[#f0f5ff] text-[#21214f] border border-[#d2e1f8]"
                  : "bg-[#f9f9f9] text-[#21214f]"
              }`}
            >
              {version2.note || <span className="text-[#767692] italic">Нет комментария</span>}
            </div>
          </div>

          {/* Checks */}
          <div>
            <div className="text-[13px] text-[#767692] mb-2">
              Проверки
              {(checks1.passed !== checks2.passed ||
                checks1.failed !== checks2.failed ||
                checks1.warnings !== checks2.warnings) && (
                <span className="ml-1 text-[#5b8def]">✓</span>
              )}
            </div>
            <div
              className={`flex items-center gap-3 rounded-[8px] p-3 ${
                checks1.passed !== checks2.passed ||
                checks1.failed !== checks2.failed ||
                checks1.warnings !== checks2.warnings
                  ? "bg-[#f0f5ff] border border-[#d2e1f8]"
                  : "bg-[#f9f9f9]"
              }`}
            >
              {checks2.total === 0 ? (
                <span className="text-[13px] text-[#767692] italic">Нет проверок</span>
              ) : (
                <>
                  {checks2.passed > 0 && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#4caf50]" />
                      <span className="text-[13px] text-[#4caf50] font-medium">
                        {checks2.passed}
                      </span>
                    </div>
                  )}
                  {checks2.warnings > 0 && (
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#ff9800]" />
                      <span className="text-[13px] text-[#ff9800] font-medium">
                        {checks2.warnings}
                      </span>
                    </div>
                  )}
                  {checks2.failed > 0 && (
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-[#d4183d]" />
                      <span className="text-[13px] text-[#d4183d] font-medium">
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

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-[#e6e8ee]">
        <p className="text-[13px] text-[#767692] flex items-center gap-1">
          <span className="text-[#5b8def]">✓</span>
          <span>— изменения по сравнению с другой версией</span>
        </p>
      </div>
    </div>
  );
}
