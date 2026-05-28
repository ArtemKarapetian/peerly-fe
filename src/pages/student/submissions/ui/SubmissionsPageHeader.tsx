import { Edit } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes.ts";

interface SubmissionsPageHeaderProps {
  taskTitle: string;
  courseId: string;
  taskId: string;
  isDeadlinePassed: boolean;
}

export function SubmissionsPageHeader({
  taskTitle,
  courseId,
  taskId,
  isDeadlinePassed,
}: SubmissionsPageHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-page-h1 font-medium text-foreground tracking-[-0.5px] mb-1">
          {t("student.submissions.title")}
        </h1>
        <p className="text-base text-muted-foreground leading-[1.5]">{taskTitle}</p>
      </div>
      {!isDeadlinePassed && (
        <button
          onClick={() => void navigate(ROUTES.submitWork(courseId, taskId))}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary-lighter hover:bg-brand-primary-light text-foreground rounded-md text-sm font-medium transition-colors"
        >
          <Edit className="size-4" />
          {t("student.submissions.editWork")}
        </button>
      )}
    </div>
  );
}
