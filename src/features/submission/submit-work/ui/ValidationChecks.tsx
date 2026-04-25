import { CheckCircle, XCircle, AlertCircle, Clock, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export type CheckStatus = "queued" | "running" | "passed" | "failed" | "warning" | "not-started";

export interface ValidationCheck {
  id: string;
  name: string;
  description: string;
  status: CheckStatus;
  message?: string;
}

interface ValidationChecksProps {
  checks: ValidationCheck[];
}

export function ValidationChecks({ checks }: ValidationChecksProps) {
  const { t } = useTranslation();

  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case "queued":
        return <Clock className="w-5 h-5 text-muted-foreground" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />;
      case "passed":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "not-started":
      default:
        return <div className="w-5 h-5 border-2 border-border rounded-full" />;
    }
  };

  const getStatusColor = (status: CheckStatus) => {
    switch (status) {
      case "queued":
        return "text-muted-foreground";
      case "running":
        return "text-brand-primary";
      case "passed":
        return "text-success";
      case "failed":
        return "text-destructive";
      case "warning":
        return "text-warning";
      case "not-started":
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusLabel = (status: CheckStatus) => {
    switch (status) {
      case "queued":
        return t("feature.validationChecks.queued");
      case "running":
        return t("feature.validationChecks.running");
      case "passed":
        return t("feature.validationChecks.passed");
      case "failed":
        return t("feature.validationChecks.failed");
      case "warning":
        return t("feature.validationChecks.warning");
      case "not-started":
      default:
        return t("feature.validationChecks.notStarted");
    }
  };

  if (checks.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-[13px] text-muted-foreground">
          {t("feature.validationChecks.willRunAfterUpload")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {checks.map((check, index) => (
        <div
          key={check.id}
          className={`p-3 transition-all ${
            index !== checks.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">{getStatusIcon(check.status)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="text-[14px] font-medium text-foreground">{check.name}</div>
                <div className={`text-[12px] font-medium ${getStatusColor(check.status)} shrink-0`}>
                  {getStatusLabel(check.status)}
                </div>
              </div>
              <div className="text-[12px] text-muted-foreground leading-[1.4]">
                {check.description}
              </div>
              {check.message && (
                <div className={`text-[12px] ${getStatusColor(check.status)} mt-2 font-medium`}>
                  {check.message}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
