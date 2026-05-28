import { useTranslation } from "react-i18next";

interface UploadConstraintsHintProps {
  acceptedFormats: string[];
  maxSizeMB: number;
}

export function UploadConstraintsHint({ acceptedFormats, maxSizeMB }: UploadConstraintsHintProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-2 text-13 text-muted-foreground">
      <div className="shrink-0">ℹ️</div>
      <div>
        <p>
          <strong>{t("feature.submission.upload.formats")}</strong> {acceptedFormats.join(", ")}
        </p>
        <p>
          <strong>{t("feature.submission.upload.maxSize")}</strong> {maxSizeMB}{" "}
          {t("feature.submission.upload.mb")}
        </p>
      </div>
    </div>
  );
}
