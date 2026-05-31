import { AlertTriangle, Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Label, TextField } from "@/shared/ui";

import { isValidDate, validateDeadlines } from "../lib/validateDeadlines";
import type { AssignmentFormData } from "../model/types";

interface StepDeadlinesProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

function formatDateForInput(date: Date | null): string {
  if (!isValidDate(date)) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseInputDate(value: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return isValidDate(parsed) ? parsed : null;
}

export function StepDeadlines({ data, onUpdate }: StepDeadlinesProps) {
  const { t } = useTranslation();

  const handleDateChange = (field: "submissionDeadline" | "reviewDeadline", value: string) => {
    onUpdate({ [field]: parseInputDate(value) });
  };

  const { errors } = validateDeadlines({
    submission: data.submissionDeadline,
    review: data.reviewDeadline,
  });

  const showTimeDiff =
    isValidDate(data.submissionDeadline) &&
    isValidDate(data.reviewDeadline) &&
    data.reviewDeadline.getTime() > data.submissionDeadline.getTime();
  const timeDiff = showTimeDiff
    ? (() => {
        const diff = data.reviewDeadline!.getTime() - data.submissionDeadline!.getTime();
        return {
          days: Math.floor(diff / 86_400_000),
          hours: Math.floor((diff % 86_400_000) / 3_600_000),
          total: diff,
        };
      })()
    : null;

  const nowIso = formatDateForInput(new Date());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.deadlines.title")}
        </h2>
      </div>

      <div>
        <Label>{t("feature.assignmentCreate.deadlines.submissionDeadlineLabel")}</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <TextField
            type="datetime-local"
            value={formatDateForInput(data.submissionDeadline)}
            onChange={(e) => handleDateChange("submissionDeadline", e.target.value)}
            min={nowIso}
            className="pl-10"
          />
        </div>
        {errors.submission && data.submissionDeadline !== null ? (
          <p className="text-13 text-destructive mt-1">
            {t(`feature.assignmentCreate.deadlines.errors.${errors.submission}`)}
          </p>
        ) : (
          <p className="text-13 text-muted-foreground mt-1">
            {t("feature.assignmentCreate.deadlines.submissionDeadlineHint")}
          </p>
        )}
      </div>

      <div>
        <Label>{t("feature.assignmentCreate.deadlines.reviewDeadlineLabel")}</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <TextField
            type="datetime-local"
            value={formatDateForInput(data.reviewDeadline)}
            onChange={(e) => handleDateChange("reviewDeadline", e.target.value)}
            min={
              isValidDate(data.submissionDeadline)
                ? formatDateForInput(data.submissionDeadline)
                : nowIso
            }
            className="pl-10"
          />
        </div>
        {errors.review && data.reviewDeadline !== null ? (
          <p className="text-13 text-destructive mt-1">
            {t(`feature.assignmentCreate.deadlines.errors.${errors.review}`)}
          </p>
        ) : (
          <p className="text-13 text-muted-foreground mt-1">
            {t("feature.assignmentCreate.deadlines.reviewDeadlineHint")}
          </p>
        )}
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
