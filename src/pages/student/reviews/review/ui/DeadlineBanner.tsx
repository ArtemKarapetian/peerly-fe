import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeadlineBannerProps {
  deadlineLabel: string;
  isSoon: boolean;
}

export function DeadlineBanner({ deadlineLabel, isSoon }: DeadlineBannerProps) {
  const { t } = useTranslation();
  const containerClass = isSoon ? "bg-warning-light border-warning" : "bg-muted border-transparent";
  const iconClass = isSoon ? "text-warning" : "text-muted-foreground";
  const textClass = isSoon ? "text-foreground font-medium" : "text-muted-foreground";

  return (
    <div className={`mt-4 rounded-lg p-4 flex items-start gap-3 border-2 ${containerClass}`}>
      <Clock className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
      <p className={`text-sm ${textClass}`}>
        {isSoon
          ? t("page.reviewFill.deadlineSoonBanner", { date: deadlineLabel })
          : t("page.reviewFill.deadlineBanner", { date: deadlineLabel })}
      </p>
    </div>
  );
}
