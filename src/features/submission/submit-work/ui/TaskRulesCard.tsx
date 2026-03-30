import { Clock, RefreshCw, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * TaskRulesCard - Карточка с правилами задания
 *
 * Displays:
 * - Deadline
 * - Allowed resubmissions
 * - Late policy
 */

export interface TaskRules {
  deadline: string; // e.g., "31 января, 23:59"
  isDeadlinePassed: boolean;
  allowedResubmissions: number;
  currentVersion: number; // 0 = no work yet
  latePolicy?: string;
}

interface TaskRulesCardProps {
  rules: TaskRules;
}

export function TaskRulesCard({ rules }: TaskRulesCardProps) {
  const { t } = useTranslation();
  const remainingResubmissions = Math.max(0, rules.allowedResubmissions - rules.currentVersion);

  return (
    <div className="space-y-4">
      {/* Deadline */}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 ${rules.isDeadlinePassed ? "bg-error-light" : "bg-warning-light"} rounded-[8px] flex items-center justify-center shrink-0`}
        >
          <Clock className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-muted-foreground mb-0.5">
            {t("feature.submission.rules.deadline")}
          </div>
          <div
            className={`text-[15px] font-medium ${rules.isDeadlinePassed ? "text-destructive" : "text-foreground"}`}
          >
            {rules.deadline}
            {rules.isDeadlinePassed && (
              <span className="ml-2 text-[13px]">{t("feature.submission.rules.overdue")}</span>
            )}
          </div>
        </div>
      </div>

      {/* Resubmissions */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-info-light rounded-[8px] flex items-center justify-center shrink-0">
          <RefreshCw className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-muted-foreground mb-0.5">
            {t("feature.submission.rules.resubmissions")}
          </div>
          <div className="text-[15px] font-medium text-foreground">
            {remainingResubmissions > 0 ? (
              <>
                {t("feature.submission.rules.remaining")}{" "}
                <span className="text-brand-primary">{remainingResubmissions}</span>
              </>
            ) : (
              <span className="text-muted-foreground">
                {t("feature.submission.rules.noneRemaining")}
              </span>
            )}
          </div>
          {rules.currentVersion > 0 && (
            <div className="text-[13px] text-muted-foreground mt-1">
              {t("feature.submission.rules.currentVersion")} v{rules.currentVersion}
            </div>
          )}
        </div>
      </div>

      {/* Late policy */}
      {rules.latePolicy && (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-warning-light rounded-[8px] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-muted-foreground mb-0.5">
              {t("feature.submission.rules.latePolicy")}
            </div>
            <div className="text-[13px] text-foreground leading-[1.5]">{rules.latePolicy}</div>
          </div>
        </div>
      )}
    </div>
  );
}
