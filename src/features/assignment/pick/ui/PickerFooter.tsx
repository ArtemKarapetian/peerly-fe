import { useTranslation } from "react-i18next";

interface PickerFooterProps {
  hasSelection: boolean;
  onCancel: () => void;
  onAttach: () => void;
}

export function PickerFooter({ hasSelection, onCancel, onAttach }: PickerFooterProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-3 p-6 border-t-2 border-border">
      <p className="text-13 text-muted-foreground">
        {hasSelection
          ? t("feature.assignmentPicker.clickAttach")
          : t("feature.assignmentPicker.selectFromList")}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
        >
          {t("common.cancel")}
        </button>
        <button
          onClick={onAttach}
          disabled={!hasSelection}
          className="px-6 py-2 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors font-medium disabled:bg-muted disabled:cursor-not-allowed"
        >
          {t("feature.assignmentPicker.attach")}
        </button>
      </div>
    </div>
  );
}
