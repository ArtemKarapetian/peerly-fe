import { FileText, Download, Trash2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  url?: string;
}

interface FilePreviewCardProps {
  file: UploadedFile;
  onReplace: () => void;
  onDownload: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function FilePreviewCard({
  file,
  onReplace,
  onDownload,
  onDelete,
  disabled = false,
}: FilePreviewCardProps) {
  const { t } = useTranslation();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} ${t("entity.work.bytes")}`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${t("entity.work.kb")}`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${t("entity.work.mb")}`;
  };

  const getFileIcon = () => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const colors: Record<string, string> = {
      pdf: "bg-error-light",
      zip: "bg-warning-light",
      doc: "bg-brand-primary-light",
      docx: "bg-brand-primary-light",
      jpg: "bg-info-light",
      jpeg: "bg-info-light",
      png: "bg-info-light",
      default: "bg-brand-primary-light",
    };

    return colors[ext || "default"] || colors.default;
  };

  return (
    <div className="bg-card border-2 border-border rounded-[12px] p-4">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 ${getFileIcon()} rounded-[8px] flex items-center justify-center shrink-0`}
        >
          <FileText className="w-6 h-6 text-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-medium text-foreground mb-1 truncate">{file.name}</div>
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>
              {t("feature.filePreview.uploadedAt")} {file.uploadedAt}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <button
          onClick={onReplace}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-surface-hover text-foreground rounded-[8px] text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("feature.filePreview.replaceFile")}</span>
        </button>

        <button
          onClick={onDownload}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-surface-hover text-foreground rounded-[8px] text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>{t("common.download")}</span>
        </button>

        <button
          onClick={onDelete}
          disabled={disabled}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-error-light hover:bg-error-light text-destructive rounded-[8px] text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t("common.delete")}</span>
        </button>
      </div>
    </div>
  );
}
