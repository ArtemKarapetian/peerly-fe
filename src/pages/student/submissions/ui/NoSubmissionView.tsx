import { Clock, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs, type BreadcrumbItem } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell";

interface NoSubmissionViewProps {
  courseId: string;
  taskId: string;
  isDeadlinePassed: boolean;
  breadcrumbs: BreadcrumbItem[];
}

export function NoSubmissionView({
  courseId,
  taskId,
  isDeadlinePassed,
  breadcrumbs,
}: NoSubmissionViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const Icon = isDeadlinePassed ? Clock : Upload;
  const iconBg = isDeadlinePassed ? "bg-error-light" : "bg-brand-primary-lighter";
  const iconColor = isDeadlinePassed ? "text-error" : "text-brand-primary";

  return (
    <AppShell title={t("student.submissions.title")}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-muted rounded-xl p-8 max-w-[480px] text-center">
          <div className="mb-4">
            <div
              className={`w-16 h-16 ${iconBg} rounded-full mx-auto flex items-center justify-center`}
            >
              <Icon className={`size-7 ${iconColor}`} />
            </div>
          </div>
          <h2 className="text-2xl font-medium text-foreground mb-3 tracking-[-0.5px]">
            {isDeadlinePassed
              ? t("student.submissions.deadlinePassedTitle")
              : t("student.submissions.noSubmissions")}
          </h2>
          <p className="text-base text-muted-foreground leading-[1.5] mb-6">
            {isDeadlinePassed
              ? t("student.submissions.deadlinePassedDesc")
              : t("student.submissions.noSubmissionsDesc")}
          </p>
          {!isDeadlinePassed && (
            <button
              onClick={() => void navigate(ROUTES.submitWork(courseId, taskId))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-md transition-colors text-15 font-medium"
            >
              {t("student.submissions.submitWork")}
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
