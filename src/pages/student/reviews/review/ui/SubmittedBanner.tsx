import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SubmittedBanner() {
  const { t } = useTranslation();
  return (
    <div className="mt-4 bg-success-light border-2 border-success rounded-lg p-4 flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
      <div>
        <h3 className="text-base font-medium text-foreground mb-1">
          {t("page.reviewFill.submittedTitle")}
        </h3>
        <p className="text-sm text-foreground">{t("page.reviewFill.submittedDesc")}</p>
      </div>
    </div>
  );
}
