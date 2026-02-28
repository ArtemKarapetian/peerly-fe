import { Clock, RefreshCw, AlertTriangle } from "lucide-react";

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
  const remainingResubmissions = Math.max(0, rules.allowedResubmissions - rules.currentVersion);

  return (
    <div className="space-y-4">
      {/* Deadline */}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 ${rules.isDeadlinePassed ? "bg-[#ffb8b8]" : "bg-[#ffd4a3]"} rounded-[8px] flex items-center justify-center shrink-0`}
        >
          <Clock className="w-5 h-5 text-[#21214f]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-[#767692] mb-0.5">Дедлайн</div>
          <div
            className={`text-[15px] font-medium ${rules.isDeadlinePassed ? "text-[#d4183d]" : "text-[#21214f]"}`}
          >
            {rules.deadline}
            {rules.isDeadlinePassed && <span className="ml-2 text-[13px]">(просрочен)</span>}
          </div>
        </div>
      </div>

      {/* Resubmissions */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-[#b0e9fb] rounded-[8px] flex items-center justify-center shrink-0">
          <RefreshCw className="w-5 h-5 text-[#21214f]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-[#767692] mb-0.5">Пересдачи</div>
          <div className="text-[15px] font-medium text-[#21214f]">
            {remainingResubmissions > 0 ? (
              <>
                Осталось: <span className="text-[#5b8def]">{remainingResubmissions}</span>
              </>
            ) : (
              <span className="text-[#767692]">Не осталось</span>
            )}
          </div>
          {rules.currentVersion > 0 && (
            <div className="text-[13px] text-[#767692] mt-1">
              Текущая версия: v{rules.currentVersion}
            </div>
          )}
        </div>
      </div>

      {/* Late policy */}
      {rules.latePolicy && (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#ffe8cc] rounded-[8px] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#21214f]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-[#767692] mb-0.5">Политика опозданий</div>
            <div className="text-[13px] text-[#21214f] leading-[1.5]">{rules.latePolicy}</div>
          </div>
        </div>
      )}
    </div>
  );
}
