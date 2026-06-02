import { AlertCircle, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DropzonePromptProps {
  isDragging: boolean;
  hasError: boolean;
}

export function DropzonePrompt({ isDragging, hasError }: DropzonePromptProps) {
  const { t } = useTranslation();
  const iconBg = hasError ? "bg-error-light" : "bg-brand-primary-light";
  return (
    <div className="space-y-3">
      <div className={`w-12 h-12 ${iconBg} rounded-full mx-auto flex items-center justify-center`}>
        {hasError ? (
          <AlertCircle className="w-6 h-6 text-error" />
        ) : (
          <Upload className="w-6 h-6 text-brand-primary" />
        )}
      </div>
      <div>
        <p className="text-15 text-foreground font-medium mb-1">
          {isDragging
            ? t("feature.submission.upload.dropFile")
            : t("feature.submission.upload.dragFileHere")}
        </p>
        <p className="text-13 text-muted-foreground">
          {t("feature.submission.upload.or")}{" "}
          <span className="text-brand-primary font-medium">
            {t("feature.submission.upload.browseFile")}
          </span>
        </p>
      </div>
    </div>
  );
}
