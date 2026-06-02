import { Clock, Edit, History, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes.ts";
import { Card } from "@/shared/ui";

interface TaskSidebarProps {
  courseId: string;
  taskId: string;
  hasSubmission: boolean;
  isDeadlinePassed: boolean;
}

export function TaskSidebar({
  courseId,
  taskId,
  hasSubmission,
  isDeadlinePassed,
}: TaskSidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card variant="section" className="p-5 space-y-3">
      {hasSubmission ? (
        <>
          <button
            onClick={() => void navigate(ROUTES.submissions(courseId, taskId))}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary-lighter hover:bg-brand-primary-light text-foreground rounded-md text-15 font-medium transition-colors"
          >
            <History className="size-4" />
            {t("student.task.viewSubmission")}
          </button>
          {!isDeadlinePassed && (
            <button
              onClick={() => void navigate(ROUTES.submitWork(courseId, taskId))}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border hover:bg-surface-hover text-foreground rounded-md text-15 font-medium transition-colors"
            >
              <Edit className="size-4" />
              {t("student.task.editSubmission")}
            </button>
          )}
        </>
      ) : isDeadlinePassed ? (
        <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-error-light text-error rounded-md text-15 font-medium">
          <Clock className="size-4" />
          {t("student.task.deadlinePassedSidebar")}
        </div>
      ) : (
        <button
          onClick={() => void navigate(ROUTES.submitWork(courseId, taskId))}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-md text-15 font-medium transition-colors"
        >
          <Upload className="size-4" />
          {t("student.task.submitWork")}
        </button>
      )}
    </Card>
  );
}
