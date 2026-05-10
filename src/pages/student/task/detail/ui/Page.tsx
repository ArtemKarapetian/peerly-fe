import { Calendar, History, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { formatDateTime } from "@/shared/lib/formatDate";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAssignment } from "@/entities/assignment";
import { useCourse } from "@/entities/course";
import { useMySubmission } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function TaskPage() {
  const { courseId = "", taskId = "" } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const CRUMBS = getCrumbs();

  const { data: hw, isLoading: hwLoading } = useAssignment(taskId);
  const { data: course } = useCourse(courseId);
  const { data: submission } = useMySubmission(taskId);

  const courseName = course?.title ?? "";
  const title = hw?.title ?? "";
  const description = hw?.description ?? "";
  const checklist = hw?.checklist ?? "";

  if (!hwLoading && !hw) {
    return (
      <AppShell title={t("student.task.notFound")}>
        <Breadcrumbs items={[CRUMBS.courses, { label: t("student.task.notFound") }]} />
        <p className="mt-6 text-[14px] text-text-tertiary">{t("student.task.notFound")}</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={title}>
      <Breadcrumbs
        items={[
          CRUMBS.courses,
          { label: courseName, href: ROUTES.course(courseId) },
          { label: title },
        ]}
      />

      <div className="mt-6 bg-card border border-border shadow-sm rounded-[20px] p-5 desktop:p-8 mb-6">
        <h1 className="text-[28px] desktop:text-[36px] font-medium tracking-[-0.5px] text-foreground leading-[1.1] mb-2">
          {title || t("common.loading")}
        </h1>
        <p className="text-[14px] desktop:text-[16px] text-muted-foreground mb-4">{courseName}</p>
        {hw?.dueDate ? (
          <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
            <Calendar className="size-4" />
            <span>
              {t("student.task.deadline")}:{" "}
              {formatDateTime(hw.dueDate.toISOString(), i18n.language)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="task-layout">
        <div className="w-full min-w-0 flex flex-col gap-4">
          <section className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6">
            <h2 className="text-[20px] font-medium tracking-[-0.3px] text-foreground mb-3">
              {t("student.task.description")}
            </h2>
            <p className="text-[14px] desktop:text-[15px] text-muted-foreground leading-[1.6] whitespace-pre-wrap">
              {description || t("student.task.noDescription")}
            </p>
          </section>

          {checklist ? (
            <section className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6">
              <h2 className="text-[20px] font-medium tracking-[-0.3px] text-foreground mb-3">
                {t("student.task.checklist")}
              </h2>
              <p className="text-[14px] desktop:text-[15px] text-muted-foreground leading-[1.6] whitespace-pre-wrap">
                {checklist}
              </p>
            </section>
          ) : null}
        </div>

        <div className="w-full min-w-0 flex flex-col gap-3 hide-below-desktop">
          <div className="task-sidebar-sticky bg-card border border-border shadow-sm rounded-[16px] p-5 space-y-3">
            {!submission ? (
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
        </div>
      </div>
    </AppShell>
  );
}
