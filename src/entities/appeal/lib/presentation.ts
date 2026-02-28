import { AppealReason, AppealStatus } from "@/entities/appeal/model/types.ts";

/**
 * Get reason label
 */
export function getReasonLabel(reason: AppealReason): string {
  const labels: Record<AppealReason, string> = {
    unfair_score: "Несправедливая оценка",
    wrong_interpretation: "Неправильная интерпретация",
    technical_issue: "Техническая проблема",
    other: "Другое",
  };
  return labels[reason];
}

/**
 * Get status label
 */
export function getStatusLabel(status: AppealStatus): string {
  const labels: Record<AppealStatus, string> = {
    new: "Новая",
    in_review: "На рассмотрении",
    resolved: "Рассмотрена",
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
