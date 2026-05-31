import { Save, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PublishActionsProps {
  mode: "create" | "edit";
  isDirty: boolean;
  submitting: boolean;
  onPublish: (asDraft: boolean) => void;
}

export function PublishActions({ mode, isDirty, submitting, onPublish }: PublishActionsProps) {
  const { t } = useTranslation();
  const saveDraftLabel =
    mode === "edit"
      ? t("feature.assignmentCreate.publish.saveDraftEdit")
      : t("feature.assignmentCreate.publish.saveDraft");
  const publishLabel = submitting
    ? t("feature.assignmentCreate.publish.publishing")
    : t("feature.assignmentCreate.publish.publishAssignment");

  return (
    <div className="flex items-center gap-3 pt-4">
      <button
        onClick={() => onPublish(true)}
        disabled={submitting || (mode === "edit" && !isDirty)}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-border text-foreground rounded-md hover:bg-muted transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        {saveDraftLabel}
      </button>
      <button
        onClick={() => onPublish(false)}
        disabled={submitting}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
        {publishLabel}
      </button>
    </div>
  );
}
