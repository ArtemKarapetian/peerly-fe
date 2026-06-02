import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { Breadcrumbs, type BreadcrumbItem } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell";

interface DeadlinePassedViewProps {
  message?: string;
  breadcrumbs: BreadcrumbItem[];
}

export function DeadlinePassedView({ message, breadcrumbs }: DeadlinePassedViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <AppShell title={t("page.reviewFill.title")}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-center min-h-[400px] mt-6">
        <div className="bg-error-light border border-error rounded-xl p-8 max-w-[480px] text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-card rounded-full mx-auto flex items-center justify-center">
              <Clock className="size-7 text-error" />
            </div>
          </div>
          <h2 className="text-2xl font-medium text-foreground mb-3 tracking-[-0.5px]">
            {t("page.reviewFill.deadlinePassedTitle")}
          </h2>
          <p className="text-base text-foreground leading-[1.5] mb-6 whitespace-pre-line">
            {message ?? t("page.reviewFill.deadlinePassedDesc")}
          </p>
          <button
            onClick={() => void navigate(ROUTES.reviews)}
            className="px-6 py-3 bg-card border border-border hover:bg-surface-hover text-foreground rounded-md transition-colors text-15 font-medium"
          >
            {t("page.reviewFill.backToReviews")}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
