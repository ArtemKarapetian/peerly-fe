import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import { FileUploadArea } from "@/features/submission/submit-work/ui/FileUploadArea";

const ACCEPTED_FORMATS = [".zip", ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"];
const MAX_FILE_SIZE_MB = 10;

interface UploadCardProps {
  isUploading: boolean;
  disabled: boolean;
  error: string;
  onFileSelected: (file: File) => void;
  onUploadError: (err: string) => void;
}

export function UploadCard({
  isUploading,
  disabled,
  error,
  onFileSelected,
  onUploadError,
}: UploadCardProps) {
  const { t } = useTranslation();
  return (
    <Card variant="section">
      <h2 className="text-15 font-medium text-foreground mb-3">
        {t("page.submitWork.uploadFiles")}
      </h2>
      <FileUploadArea
        acceptedFormats={ACCEPTED_FORMATS}
        maxSizeMB={MAX_FILE_SIZE_MB}
        onFileSelected={onFileSelected}
        onUploadError={onUploadError}
        isUploading={isUploading}
        error={error}
        disabled={disabled}
      />
    </Card>
  );
}
