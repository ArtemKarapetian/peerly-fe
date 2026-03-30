import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { TaskReviewAccordion } from "@/widgets/received-reviews";

import { mockReceivedReviews } from "../model/mockReceivedReviews";

export default function ReceivedReviewsPage() {
  const { t } = useTranslation();

  return (
    <AppShell title={t("student.receivedReviews.title")}>
      <div className="max-w-[1000px]">
        <PageHeader
          title={t("student.receivedReviews.title")}
          subtitle={t("student.receivedReviews.subtitle")}
        />

        {mockReceivedReviews.length > 0 ? (
          <TaskReviewAccordion tasks={mockReceivedReviews} />
        ) : (
          <div className="bg-muted rounded-[20px] p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary-lighter rounded-full mb-4">
              <FileText className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-[20px] font-medium text-foreground mb-2 tracking-[-0.5px]">
              {t("student.receivedReviews.noReviews")}
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.5] mb-6">
              {t("student.receivedReviews.willAppear")}
            </p>
            <button
              onClick={() => (window.location.hash = "/courses")}
              className="inline-flex items-center justify-center px-5 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-[12px] text-[15px] font-medium transition-colors"
            >
              {t("student.receivedReviews.goToCourses")}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
