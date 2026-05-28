import { AlertCircle, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UnsavedChangesBannerProps {
  onSave: () => void;
}

export function UnsavedChangesBanner({ onSave }: UnsavedChangesBannerProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-6 flex items-center justify-between bg-warning-light border border-warning rounded-md p-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-warning" />
        <span className="text-sm text-warning font-medium">
          {t("widget.rubricEditor.unsavedChanges")}
        </span>
      </div>
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-inverse rounded-md hover:bg-brand-primary-hover transition-colors text-sm font-medium"
      >
        <Save className="w-4 h-4" />
        {t("common.save")}
      </button>
    </div>
  );
}
