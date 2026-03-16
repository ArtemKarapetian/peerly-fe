import i18n from "@/shared/lib/i18n/config";

import { AppealReason, AppealStatus } from "@/entities/appeal/model/types.ts";

/**
 * Get reason label
 */
export function getReasonLabel(reason: AppealReason): string {
  const labels: Record<AppealReason, string> = {
    unfair_score: i18n.t("entity.appeal.reasonUnfair"),
    wrong_interpretation: i18n.t("entity.appeal.reasonWrongInterpretation"),
    technical_issue: i18n.t("entity.appeal.reasonTechnical"),
    other: i18n.t("entity.appeal.reasonOther"),
  };
  return labels[reason];
}

/**
 * Get status label
 */
export function getStatusLabel(status: AppealStatus): string {
  const labels: Record<AppealStatus, string> = {
    new: i18n.t("entity.appeal.statusNew"),
    in_review: i18n.t("entity.appeal.statusInReview"),
    resolved: i18n.t("entity.appeal.statusResolved"),
  };
  return labels[status];
}

/**
 * Get status color classes
 */
export function getStatusColor(status: AppealStatus): string {
  const colors: Record<AppealStatus, string> = {
    new: "bg-blue-100 text-blue-800 border-blue-200",
    in_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
  };
  return colors[status];
}
