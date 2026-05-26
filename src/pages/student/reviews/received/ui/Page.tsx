import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { TaskReviewAccordion } from "@/widgets/received-reviews";

import { useReceivedReviews } from "../model/queries";

export default function ReceivedReviewsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useReceivedReviews();
  const tasks = data ?? [];

  return (
    <AppShell title={t("student.receivedReviews.title")}>
      <div className="max-w-[1000px]">
        <PageHeader
          title={t("student.receivedReviews.title")}
          subtitle={t("student.receivedReviews.subtitle")}
        />

        {isLoading ? (
          <p className="text-sm text-text-tertiary">{t("common.loading")}</p>
        ) : tasks.length > 0 ? (
          <TaskReviewAccordion tasks={tasks} />
        ) : (
          <div className="bg-muted rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary-lighter rounded-full mb-4">
              <FileText className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2 tracking-[-0.5px]">
              {t("student.receivedReviews.noReviews")}
            </h3>
            <p className="text-15 text-muted-foreground leading-[1.5] mb-6">
              {t("student.receivedReviews.willAppear")}
            </p>
            <button
              onClick={() => void navigate(ROUTES.courses)}
              className="inline-flex items-center justify-center px-5 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-md text-15 font-medium transition-colors"
            >
              {t("student.receivedReviews.goToCourses")}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
