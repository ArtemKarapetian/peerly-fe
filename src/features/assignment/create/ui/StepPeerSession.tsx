import { Users, Shuffle, EyeOff, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AssignmentFormData } from "../model/types";

/**
 * StepPeerSession - Шаг 4: Настройки peer review
 *
 * - Количество рецензий на работу (k)
 * - Режим распределения (случайный/по навыкам/вручную)
 * - Анонимность (полная/частичная/без анонимности)
 * - Переназначение рецензий
 */

interface StepPeerSessionProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

export function StepPeerSession({ data, onUpdate }: StepPeerSessionProps) {
  const { t } = useTranslation();

  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateChange = (value: string) => {
    onUpdate({
      reassignmentDeadline: value ? new Date(value) : null,
    });
  };

  const getReviewForm = (count: number) => {
    if (count === 1) return t("feature.assignmentCreate.peerSession.reviewOne");
    if (count < 5) return t("feature.assignmentCreate.peerSession.reviewFew");
    return t("feature.assignmentCreate.peerSession.reviewMany");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.peerSession.title")}
        </h2>
        <p className="text-[15px] text-muted-foreground">
          {t("feature.assignmentCreate.peerSession.subtitle")}
        </p>
      </div>

      {/* Reviews Per Submission */}
      <div>
        <label className="block text-[14px] font-medium text-foreground mb-3">
          {t("feature.assignmentCreate.peerSession.reviewsPerSubmissionLabel")}{" "}
          <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={data.reviewsPerSubmission}
            onChange={(e) => onUpdate({ reviewsPerSubmission: parseInt(e.target.value) })}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={data.reviewsPerSubmission}
              onChange={(e) => onUpdate({ reviewsPerSubmission: parseInt(e.target.value) || 1 })}
              className="w-16 px-3 py-2 border-2 border-border rounded-[8px] text-[15px] font-medium text-center focus:outline-none focus:border-brand-primary"
            />
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground mt-2">
          {t("feature.assignmentCreate.peerSession.reviewsHint", {
            count: data.reviewsPerSubmission,
            form: getReviewForm(data.reviewsPerSubmission),
          })}
        </p>
      </div>

      {/* Distribution Mode */}
      <div>
        <label className="block text-[14px] font-medium text-foreground mb-3">
          {t("feature.assignmentCreate.peerSession.distributionLabel")}
        </label>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onUpdate({ distributionMode: "random" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.distributionMode === "random"
                  ? "border-brand-primary bg-brand-primary-light"
                  : "border-border hover:border-brand-primary bg-card"
              }
            `}
          >
            <Shuffle className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.peerSession.distributionRandom")}
              </div>
              <div className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.peerSession.distributionRandomDesc")}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ distributionMode: "skill-based" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.distributionMode === "skill-based"
                  ? "border-brand-primary bg-brand-primary-light"
                  : "border-border hover:border-brand-primary bg-card"
              }
            `}
          >
            <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.peerSession.distributionSkillBased")}
              </div>
              <div className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.peerSession.distributionSkillBasedDesc")}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ distributionMode: "manual" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.distributionMode === "manual"
                  ? "border-brand-primary bg-brand-primary-light"
                  : "border-border hover:border-brand-primary bg-card"
              }
            `}
          >
            <RefreshCw className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.peerSession.distributionManual")}
              </div>
              <div className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.peerSession.distributionManualDesc")}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Anonymity Mode */}
      <div>
        <label className="block text-[14px] font-medium text-foreground mb-3">
          {t("feature.assignmentCreate.peerSession.anonymityLabel")}
        </label>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onUpdate({ anonymityMode: "full" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.anonymityMode === "full"
                  ? "border-brand-primary bg-brand-primary-light"
                  : "border-border hover:border-brand-primary bg-card"
              }
            `}
          >
            <EyeOff className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.peerSession.anonymityFull")}
              </div>
              <div className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.peerSession.anonymityFullDesc")}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ anonymityMode: "partial" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.anonymityMode === "partial"
                  ? "border-brand-primary bg-brand-primary-light"
                  : "border-border hover:border-brand-primary bg-card"
              }
            `}
          >
            <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.peerSession.anonymityPartial")}
              </div>
              <div className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.peerSession.anonymityPartialDesc")}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ anonymityMode: "none" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.anonymityMode === "none"
                  ? "border-brand-primary bg-brand-primary-light"
                  : "border-border hover:border-brand-primary bg-card"
              }
            `}
          >
            <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.peerSession.anonymityNone")}
              </div>
              <div className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.peerSession.anonymityNoneDesc")}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Reassignment */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={data.allowReassignment}
            onChange={(e) => onUpdate({ allowReassignment: e.target.checked })}
            className="w-5 h-5 rounded border-2 border-border text-brand-primary focus:ring-ring"
          />
          <span className="text-[14px] font-medium text-foreground">
            {t("feature.assignmentCreate.peerSession.allowReassignment")}
          </span>
        </label>

        {data.allowReassignment && (
          <div className="ml-7 space-y-3">
            <p className="text-[13px] text-muted-foreground">
              {t("feature.assignmentCreate.peerSession.reassignmentHint")}
            </p>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">
                {t("feature.assignmentCreate.peerSession.reassignmentDeadlineLabel")}
              </label>
              <input
                type="datetime-local"
                value={formatDateForInput(data.reassignmentDeadline)}
                onChange={(e) => handleDateChange(e.target.value)}
                max={formatDateForInput(data.reviewDeadline)}
                className="w-full px-4 py-2 border-2 border-border rounded-[8px] text-[14px] focus:outline-none focus:border-brand-primary transition-colors"
              />
              <p className="text-[12px] text-muted-foreground mt-1">
                {t("feature.assignmentCreate.peerSession.reassignmentDeadlineHint")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-info-light border border-info rounded-[12px] p-4">
        <p className="text-[13px] text-foreground">
          <strong>{t("feature.assignmentCreate.peerSession.tip")}</strong>{" "}
          {t("feature.assignmentCreate.peerSession.tipText")}
        </p>
      </div>
    </div>
  );
}
