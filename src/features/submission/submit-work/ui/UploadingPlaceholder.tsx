import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

export function UploadingPlaceholder() {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="w-12 h-12 bg-brand-primary-light rounded-full mx-auto flex items-center justify-center animate-pulse">
        <Upload className="w-6 h-6 text-brand-primary" />
      </div>
      <p className="text-15 text-foreground font-medium">
        {t("feature.submission.upload.uploading")}
      </p>
    </div>
  );
}
