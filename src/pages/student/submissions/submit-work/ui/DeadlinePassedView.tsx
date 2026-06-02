import { ArrowLeft, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell";

interface DeadlinePassedViewProps {
  courseId: string;
  taskId: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function DeadlinePassedView({ courseId, taskId, breadcrumbs }: DeadlinePassedViewProps) {
  const { t } = useTranslation();
  return (
    <AppShell title={t("page.submitWork.title")}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-center min-h-[400px] mt-6">
        <div className="bg-error-light border border-error rounded-xl p-8 max-w-[480px] text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-card rounded-full mx-auto flex items-center justify-center">
              <Clock className="size-7 text-error" />
            </div>
          </div>
          <h2 className="text-2xl font-medium text-foreground mb-3 tracking-[-0.5px]">
            {t("page.submitWork.deadlinePassedTitle")}
          </h2>
          <p className="text-base text-foreground leading-[1.5] mb-6">
            {t("page.submitWork.deadlinePassedDesc")}
          </p>
          <Link
            to={ROUTES.task(courseId, taskId)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border hover:bg-surface-hover text-foreground rounded-md transition-colors text-15 font-medium"
          >
            <ArrowLeft className="size-4" />
            {t("page.submitWork.backToTask")}
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
