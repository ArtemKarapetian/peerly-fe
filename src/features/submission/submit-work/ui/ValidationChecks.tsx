import { CheckCircle, XCircle, AlertCircle, Clock, Loader2 } from "lucide-react";

/**
 * ValidationChecks - Список проверок работы
 *
 * Checks:
 * - Plagiarism detection
 * - Code linting
 * - Format validation
 * - Anonymization check
 *
 * Statuses: Queued, Running, Passed, Failed, Warning
 */

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
  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case "queued":
        return <Clock className="w-5 h-5 text-[#767692]" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-[#5b8def] animate-spin" />;
      case "passed":
        return <CheckCircle className="w-5 h-5 text-[#4caf50]" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-[#d4183d]" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-[#ff9800]" />;
      case "not-started":
      default:
        return <div className="w-5 h-5 border-2 border-[#e6e8ee] rounded-full" />;
    }
  };

  const getStatusColor = (status: CheckStatus) => {
    switch (status) {
      case "queued":
        return "text-[#767692]";
      case "running":
        return "text-[#5b8def]";
      case "passed":
        return "text-[#4caf50]";
      case "failed":
        return "text-[#d4183d]";
      case "warning":
        return "text-[#ff9800]";
      case "not-started":
      default:
        return "text-[#767692]";
    }
  };

  const getStatusLabel = (status: CheckStatus) => {
    switch (status) {
      case "queued":
        return "В очереди";
      case "running":
        return "Проверяется...";
      case "passed":
        return "Пройдено";
      case "failed":
        return "Не пройдено";
      case "warning":
        return "Предупреждение";
      case "not-started":
      default:
        return "Не начато";
    }
  };

  if (checks.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-[13px] text-[#767692]">Проверки будут запущены после загрузки файла</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {checks.map((check, index) => (
        <div
          key={check.id}
          className={`p-3 transition-all ${
            index !== checks.length - 1 ? "border-b border-[#e6e8ee]" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="shrink-0 mt-0.5">{getStatusIcon(check.status)}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="text-[14px] font-medium text-[#21214f]">{check.name}</div>
                <div className={`text-[12px] font-medium ${getStatusColor(check.status)} shrink-0`}>
                  {getStatusLabel(check.status)}
                </div>
              </div>
              <div className="text-[12px] text-[#767692] leading-[1.4]">{check.description}</div>
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
