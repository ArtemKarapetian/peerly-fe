import { ArrowLeft, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

interface ActionsBarProps {
  saving: boolean;
  disabled: boolean;
  canSave: boolean;
  errorMessage: string;
  onBack: () => void;
  onSave: () => void;
}

export function ActionsBar({
  saving,
  disabled,
  canSave,
  errorMessage,
  onBack,
  onSave,
}: ActionsBarProps) {
  const { t } = useTranslation();
  return (
    <Card variant="section">
      <div className="flex flex-col tablet:flex-row gap-3">
        <button
          onClick={onBack}
          disabled={disabled}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border text-foreground rounded-md text-15 font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("page.submitWork.goToMySubmission")}
        </button>
        <button
          onClick={onSave}
          disabled={disabled || !canSave}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-md text-15 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="size-4" />
          {saving ? t("page.submitWork.saving") : t("page.submitWork.saveDraft")}
        </button>
      </div>
      {errorMessage && <p className="text-13 text-error mt-3 text-center">{errorMessage}</p>}
    </Card>
  );
}
