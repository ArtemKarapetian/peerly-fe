import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface TaskRules {
  deadline: string;
  isDeadlinePassed: boolean;
}

interface TaskRulesCardProps {
  rules: TaskRules;
}

export function TaskRulesCard({ rules }: TaskRulesCardProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 ${rules.isDeadlinePassed ? "bg-error-light" : "bg-warning-light"} rounded-sm flex items-center justify-center shrink-0`}
        >
          <Clock className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-13 text-muted-foreground mb-0.5">
            {t("feature.submission.rules.deadline")}
          </div>
          <div
            className={`text-15 font-medium ${rules.isDeadlinePassed ? "text-destructive" : "text-foreground"}`}
          >
            {rules.deadline}
            {rules.isDeadlinePassed && (
              <span className="ml-2 text-13">{t("feature.submission.rules.overdue")}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
