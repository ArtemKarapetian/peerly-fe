import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

import { AppShell } from "@/widgets/app-shell";

export function NotFoundView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <AppShell title={t("page.reviewFill.notFoundTitle")}>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-muted rounded-xl p-8 max-w-[480px] text-center">
          <h2 className="text-2xl font-medium text-foreground mb-3 tracking-[-0.5px]">
            {t("page.reviewFill.notFoundTitle")}
          </h2>
          <p className="text-base text-muted-foreground leading-[1.5] mb-6">
            {t("page.reviewFill.notFoundDesc")}
          </p>
          <button
            onClick={() => void navigate(ROUTES.reviews)}
            className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-md text-15 font-medium transition-colors"
          >
            {t("page.reviewFill.backToReviews")}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
