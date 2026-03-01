import { AlertCircle, CheckCircle, Download, ExternalLink, FileText, XCircle } from "lucide-react";

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
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
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
    <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-4 desktop:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#e6e8ee]">
        <h3 className="text-[18px] desktop:text-[20px] font-medium text-[#21214f] tracking-[-0.5px]">
          Работа студента
        </h3>
        {onOpenInNewWindow && (
          <button
            onClick={onOpenInNewWindow}
            className="inline-flex items-center gap-1.5 text-[13px] text-[#5b8def] hover:text-[#3d6bc6] transition-colors"
          >
            <span>Открыть в новом окне</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Files */}
      <div className="mb-4">
        <h4 className="text-[14px] font-medium text-[#21214f] mb-2">Файлы ({files.length})</h4>
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 bg-[#f9f9f9] rounded-[8px] px-3 py-2.5"
            >
              <FileText className="w-4 h-4 text-[#767692] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#21214f] truncate">{file.name}</p>
                <p className="text-[12px] text-[#767692]">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => onDownloadFile(file.id)}
                className="p-2 hover:bg-[#e6e8ee] rounded-[8px] transition-colors"
                aria-label="Скачать файл"
              >
                <Download className="w-4 h-4 text-[#5b8def]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Checks */}
      {checksSummary && (
        <div>
          <h4 className="text-[14px] font-medium text-[#21214f] mb-2">Проверки</h4>
          <div className="bg-[#f9f9f9] rounded-[12px] p-3">
            <div className="flex items-center gap-4 flex-wrap">
              {checksSummary.passed > 0 && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#4caf50]" />
                  <span className="text-[13px] text-[#4caf50] font-medium">
                    {checksSummary.passed} пройдено
                  </span>
                </div>
              )}
              {checksSummary.warnings > 0 && (
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#ff9800]" />
                  <span className="text-[13px] text-[#ff9800] font-medium">
                    {checksSummary.warnings} предупреждений
                  </span>
                </div>
              )}
              {checksSummary.failed > 0 && (
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#d4183d]" />
                  <span className="text-[13px] text-[#d4183d] font-medium">
                    {checksSummary.failed} не пройдено
                  </span>
                </div>
              )}
            </div>

            {/* Detailed checks */}
            <div className="mt-3 space-y-2">
              {validationChecks.map((check) => (
                <div key={check.id} className="flex items-start gap-2 text-[13px]">
                  {check.status === "passed" && (
                    <CheckCircle className="w-4 h-4 text-[#4caf50] shrink-0 mt-0.5" />
                  )}
                  {check.status === "warning" && (
                    <AlertCircle className="w-4 h-4 text-[#ff9800] shrink-0 mt-0.5" />
                  )}
                  {check.status === "failed" && (
                    <XCircle className="w-4 h-4 text-[#d4183d] shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#21214f] font-medium">{check.name}</p>
                    {check.message && <p className="text-[#767692] mt-0.5">{check.message}</p>}
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
