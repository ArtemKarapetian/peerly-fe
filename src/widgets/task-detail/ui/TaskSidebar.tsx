import { History, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes.ts";

interface TaskSidebarProps {
  courseId: string;
  taskId: string;
  hasSubmission: boolean;
}

export function TaskSidebar({ courseId, taskId, hasSubmission }: TaskSidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border shadow-sm rounded-[16px] p-5 space-y-3">
      {!hasSubmission ? (
        <button
          onClick={() => void navigate(ROUTES.submitWork(courseId, taskId))}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-[12px] text-[15px] font-medium transition-colors"
        >
          <Upload className="size-4" />
          {t("student.task.submitWork")}
        </button>
      ) : (
        <button
          onClick={() => void navigate(ROUTES.submissions(courseId, taskId))}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary-lighter hover:bg-brand-primary-light text-foreground rounded-[12px] text-[15px] font-medium transition-colors"
        >
          <History className="size-4" />
          {t("student.task.viewSubmission")}
        </button>
      )}
    </div>
  );
}
