import { Download, FileText, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import { formatFileSize } from "../lib/formatters";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
}

interface UploadedFilesListProps {
  files: UploadedFile[];
  disabled: boolean;
  onDownload: (fileId: string, fileName: string) => void;
  onDelete: (fileId: string) => void;
}

export function UploadedFilesList({
  files,
  disabled,
  onDownload,
  onDelete,
}: UploadedFilesListProps) {
  const { t } = useTranslation();
  if (files.length === 0) return null;

  return (
    <Card variant="section">
      <h2 className="text-15 font-medium text-foreground mb-3">
        {t("page.submitWork.uploadedFiles")}
      </h2>
      <ul className="space-y-2">
        {files.map((file) => (
          <FileRow
            key={file.id}
            file={file}
            disabled={disabled}
            onDownload={() => onDownload(file.id, file.name)}
            onDelete={() => onDelete(file.id)}
          />
        ))}
      </ul>
    </Card>
  );
}

interface FileRowProps {
  file: UploadedFile;
  disabled: boolean;
  onDownload: () => void;
  onDelete: () => void;
}

function FileRow({ file, disabled, onDownload, onDelete }: FileRowProps) {
  const { t } = useTranslation();
  return (
    <li className="flex items-center gap-3 bg-muted rounded-2md px-3 py-2">
      <FileText className="size-5 text-brand-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
        <div className="text-xs text-muted-foreground">{formatFileSize(file.size, t)}</div>
      </div>
      <button
        onClick={onDownload}
        disabled={disabled}
        title={t("common.download")}
        className="inline-flex items-center justify-center size-8 bg-card border border-border hover:bg-surface-hover rounded-sm transition-colors disabled:opacity-50"
      >
        <Download className="size-4" />
      </button>
      <button
        onClick={onDelete}
        disabled={disabled}
        title={t("common.delete")}
        className="inline-flex items-center justify-center size-8 bg-error-light text-destructive hover:bg-error-light rounded-sm transition-colors disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}
