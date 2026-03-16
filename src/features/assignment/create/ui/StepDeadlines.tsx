import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AssignmentFormData } from "../model/types";

/**
 * StepDeadlines - Шаг 2: Дедлайны
 *
 * - Дедлайн сдачи работы
 * - Дедлайн рецензирования
 * - Политика опозданий (мягкая/жесткая)
 * - Часовой пояс
 */

interface StepDeadlinesProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

export function StepDeadlines({ data, onUpdate }: StepDeadlinesProps) {
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

  const handleDateChange = (
    field: "submissionDeadline" | "reviewDeadline" | "reassignmentDeadline",
    value: string,
  ) => {
    onUpdate({
      [field]: value ? new Date(value) : null,
    });
  };

  // Calculate time between deadlines
  const getTimeDifference = () => {
    if (!data.submissionDeadline || !data.reviewDeadline) return null;
    const diff = data.reviewDeadline.getTime() - data.submissionDeadline.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours, total: diff };
  };

  const timeDiff = getTimeDifference();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.deadlines.title")}
        </h2>
        <p className="text-[15px] text-[#767692]">
          {t("feature.assignmentCreate.deadlines.subtitle")}
        </p>
      </div>

      {/* Submission Deadline */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-2">
          {t("feature.assignmentCreate.deadlines.submissionDeadlineLabel")}{" "}
          <span className="text-[#d4183d]">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767692] pointer-events-none" />
          <input
            type="datetime-local"
            value={formatDateForInput(data.submissionDeadline)}
            onChange={(e) => handleDateChange("submissionDeadline", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>
        <p className="text-[13px] text-[#767692] mt-1">
          {t("feature.assignmentCreate.deadlines.submissionDeadlineHint")}
        </p>
      </div>

      {/* Review Deadline */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-2">
          {t("feature.assignmentCreate.deadlines.reviewDeadlineLabel")}{" "}
          <span className="text-[#d4183d]">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767692] pointer-events-none" />
          <input
            type="datetime-local"
            value={formatDateForInput(data.reviewDeadline)}
            onChange={(e) => handleDateChange("reviewDeadline", e.target.value)}
            min={formatDateForInput(data.submissionDeadline)}
            className="w-full pl-10 pr-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>
        <p className="text-[13px] text-[#767692] mt-1">
          {t("feature.assignmentCreate.deadlines.reviewDeadlineHint")}
        </p>
      </div>

      {/* Time Difference Display */}
      {timeDiff && (
        <div
          className={`
            flex items-start gap-3 p-4 rounded-[12px] border
            ${
              timeDiff.total < 2 * 24 * 60 * 60 * 1000
                ? "bg-[#fff8e1] border-[#ffe082]"
                : "bg-[#e8f5e9] border-[#c8e6c9]"
            }
          `}
        >
          <Clock className="w-5 h-5 text-[#21214f] mt-0.5" />
          <div>
            <p className="text-[14px] font-medium text-[#21214f] mb-1">
              {t("feature.assignmentCreate.deadlines.timeForReview")}{" "}
              {timeDiff.days > 0 &&
                `${timeDiff.days} ${t("feature.assignmentCreate.deadlines.days")} `}
              {timeDiff.hours} {t("feature.assignmentCreate.deadlines.hours")}
            </p>
            {timeDiff.total < 2 * 24 * 60 * 60 * 1000 && (
              <p className="text-[13px] text-[#f57c00]">
                {t("feature.assignmentCreate.deadlines.reviewTimeWarning")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Late Policy */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-3">
          {t("feature.assignmentCreate.deadlines.latePolicyLabel")}
        </label>
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onUpdate({ latePolicy: "soft" })}
            className={`
              p-4 border-2 rounded-[12px] text-left transition-all
              ${
                data.latePolicy === "soft"
                  ? "border-[#5b8def] bg-[#e9f5ff]"
                  : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
              }
            `}
          >
            <div className="text-[15px] font-medium text-[#21214f] mb-1">
              {t("feature.assignmentCreate.deadlines.latePolicySoft")}
            </div>
            <div className="text-[13px] text-[#767692]">
              {t("feature.assignmentCreate.deadlines.latePolicySoftDesc")}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ latePolicy: "hard" })}
            className={`
              p-4 border-2 rounded-[12px] text-left transition-all
              ${
                data.latePolicy === "hard"
                  ? "border-[#5b8def] bg-[#e9f5ff]"
                  : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
              }
            `}
          >
            <div className="text-[15px] font-medium text-[#21214f] mb-1">
              {t("feature.assignmentCreate.deadlines.latePolicyHard")}
            </div>
            <div className="text-[13px] text-[#767692]">
              {t("feature.assignmentCreate.deadlines.latePolicyHardDesc")}
            </div>
          </button>
        </div>
      </div>

      {/* Late Penalty (if soft policy) */}
      {data.latePolicy === "soft" && (
        <div>
          <label className="block text-[14px] font-medium text-[#21214f] mb-2">
            {t("feature.assignmentCreate.deadlines.latePenaltyLabel")}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={data.latePenalty}
              onChange={(e) => onUpdate({ latePenalty: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-[18px] font-medium text-[#21214f] w-16 text-right">
              {data.latePenalty}%
            </span>
          </div>
          <p className="text-[13px] text-[#767692] mt-2">
            {t("feature.assignmentCreate.deadlines.latePenaltyExample", {
              penalty: data.latePenalty,
              max: 100 - data.latePenalty * 2,
            })}
          </p>
        </div>
      )}

      {/* Timezone */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-2">
          {t("feature.assignmentCreate.deadlines.timezoneLabel")}
        </label>
        <select
          value={data.timezone}
          onChange={(e) => onUpdate({ timezone: e.target.value })}
          className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors bg-white"
        >
          <option value="Europe/Moscow">
            {t("feature.assignmentCreate.deadlines.timezoneMoscow")}
          </option>
          <option value="Europe/London">
            {t("feature.assignmentCreate.deadlines.timezoneLondon")}
          </option>
          <option value="America/New_York">
            {t("feature.assignmentCreate.deadlines.timezoneNewYork")}
          </option>
          <option value="Asia/Tokyo">
            {t("feature.assignmentCreate.deadlines.timezoneTokyo")}
          </option>
          <option value="Australia/Sydney">
            {t("feature.assignmentCreate.deadlines.timezoneSydney")}
          </option>
        </select>
        <p className="text-[13px] text-[#767692] mt-1">
          {t("feature.assignmentCreate.deadlines.timezoneHint")}
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 bg-[#fff8e1] border border-[#ffe082] rounded-[12px] p-4">
        <AlertTriangle className="w-5 h-5 text-[#f57c00] shrink-0 mt-0.5" />
        <div className="text-[13px] text-[#21214f]">
          <p className="font-medium mb-1">{t("feature.assignmentCreate.deadlines.warningTitle")}</p>
          <p className="text-[#767692]">{t("feature.assignmentCreate.deadlines.warningText")}</p>
        </div>
      </div>
    </div>
  );
}
