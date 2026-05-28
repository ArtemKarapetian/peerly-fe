import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface DraftActionsProps {
  assignmentId: string;
  deleting: boolean;
  onDelete: () => void;
}

export function DraftActions({ assignmentId, deleting, onDelete }: DraftActionsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={() => void navigate(`/teacher/assignments/new?edit=${assignmentId}`)}
        className="flex items-center gap-2 px-4 py-3 border-2 border-border text-foreground rounded-md hover:bg-muted transition-colors"
      >
        <Edit className="w-4 h-4" />
        <span className="text-sm font-medium">{t("teacher.assignmentDetail.editBtn")}</span>
      </button>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="flex items-center gap-2 px-4 py-3 border-2 border-border text-error rounded-md hover:border-error hover:bg-error-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-4 h-4" />
        <span className="text-sm font-medium">{t("teacher.assignmentDetail.deleteBtn")}</span>
      </button>
    </div>
  );
}
