import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AssignmentFormData } from "../model/types";

interface StepDeadlinesProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

function formatDateForInput(date: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function StepDeadlines({ data, onUpdate }: StepDeadlinesProps) {
  const { t } = useTranslation();

  const handleDateChange = (field: "submissionDeadline" | "reviewDeadline", value: string) => {
    onUpdate({ [field]: value ? new Date(value) : null });
  };

  const timeDiff = (() => {
    if (!data.submissionDeadline || !data.reviewDeadline) return null;
    const diff = data.reviewDeadline.getTime() - data.submissionDeadline.getTime();
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      total: diff,
    };
  })();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.deadlines.title")}
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("feature.assignmentCreate.deadlines.submissionDeadlineLabel")}
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="datetime-local"
            value={formatDateForInput(data.submissionDeadline)}
            onChange={(e) => handleDateChange("submissionDeadline", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-md text-15 focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <p className="text-13 text-muted-foreground mt-1">
          {t("feature.assignmentCreate.deadlines.submissionDeadlineHint")}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("feature.assignmentCreate.deadlines.reviewDeadlineLabel")}
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="datetime-local"
            value={formatDateForInput(data.reviewDeadline)}
            onChange={(e) => handleDateChange("reviewDeadline", e.target.value)}
            min={formatDateForInput(data.submissionDeadline)}
            className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-md text-15 focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <p className="text-13 text-muted-foreground mt-1">
          {t("feature.assignmentCreate.deadlines.reviewDeadlineHint")}
        </p>
      </div>

      {timeDiff && (
        <div
          className={`flex items-start gap-3 p-4 rounded-md border ${
            timeDiff.total < 2 * 86_400_000
              ? "bg-warning-light border-warning"
              : "bg-success-light border-success"
          }`}
        >
          <Clock className="w-5 h-5 text-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              {t("feature.assignmentCreate.deadlines.timeForReview")}{" "}
              {timeDiff.days > 0 &&
                `${timeDiff.days} ${t("feature.assignmentCreate.deadlines.days")} `}
              {timeDiff.hours} {t("feature.assignmentCreate.deadlines.hours")}
            </p>
            {timeDiff.total < 2 * 86_400_000 && (
              <p className="text-13 text-warning">
                {t("feature.assignmentCreate.deadlines.reviewTimeWarning")}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 bg-warning-light border border-warning rounded-md p-4">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">
            {t("feature.assignmentCreate.deadlines.warningTitle")}
          </p>
          <p className="text-13 text-muted-foreground">
            {t("feature.assignmentCreate.deadlines.warningText")}
          </p>
        </div>
      </div>
    </div>
  );
}
