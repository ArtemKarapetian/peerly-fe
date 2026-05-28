import { useTranslation } from "react-i18next";

interface ImportModalFooterProps {
  selectedCount: number;
  isAdding: boolean;
  canSubmit: boolean;
  onCancel: () => void;
  onAdd: () => void;
}

export function ImportModalFooter({
  selectedCount,
  isAdding,
  canSubmit,
  onCancel,
  onAdd,
}: ImportModalFooterProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-3 p-6 border-t-2 border-border">
      <p className="text-13 text-muted-foreground">
        {t("feature.participantImport.selectedCount", { count: selectedCount })}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
        >
          {t("feature.participantImport.cancel")}
        </button>
        <button
          onClick={onAdd}
          disabled={!canSubmit}
          className="px-6 py-2 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isAdding
            ? t("common.saving")
            : t("feature.participantImport.addBtn", { count: selectedCount })}
        </button>
      </div>
    </div>
  );
}
