/**
 * Appeals System - Data Models and Storage
 *
 * Manages student appeals (regrade/review requests) with localStorage persistence
 */

export type AppealStatus = "new" | "in_review" | "resolved";
export type AppealReason = "unfair_score" | "wrong_interpretation" | "technical_issue" | "other";

export interface Appeal {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  taskId: string;
  taskName: string;

  // Appeal details
  reason: AppealReason;
  message: string;
  attachmentName?: string; // Demo only

  // Context from submission
  currentScore?: number;
  maxScore?: number;
  reviewCount?: number;

  // Status tracking
  status: AppealStatus;
  createdAt: string;
  updatedAt: string;

  // Teacher response (for future implementation)
  teacherResponse?: {
    message: string;
    respondedBy: string;
    respondedAt: string;
    newScore?: number;
  };
}

const STORAGE_KEY = "peerly_appeals";

/**
 * Get all appeals from storage
 */
export function getAppeals(): Appeal[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load appeals:", e);
  }
  return [];
}

/**
 * Get appeals for a specific student
 */
export function getStudentAppeals(studentId: string): Appeal[] {
  return getAppeals().filter((a) => a.studentId === studentId);
}

/**
 * Get appeal by ID
 */
export function getAppealById(id: string): Appeal | undefined {
  return getAppeals().find((a) => a.id === id);
}

/**
 * Create a new appeal
 */
export function createAppeal(
  appeal: Omit<Appeal, "id" | "status" | "createdAt" | "updatedAt">,
): Appeal {
  const newAppeal: Appeal = {
    ...appeal,
    id: `appeal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const appeals = getAppeals();
  appeals.push(newAppeal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appeals));

  return newAppeal;
}

/**
 * Update appeal status
 */
export function updateAppealStatus(id: string, status: AppealStatus): void {
  const appeals = getAppeals();
  const appeal = appeals.find((a) => a.id === id);
  if (appeal) {
    appeal.status = status;
    appeal.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appeals));
  }
}

/**
 * Add teacher response to appeal
 */
export function addTeacherResponse(id: string, response: Appeal["teacherResponse"]): void {
  const appeals = getAppeals();
  const appeal = appeals.find((a) => a.id === id);
  if (appeal) {
    appeal.teacherResponse = response;
    appeal.status = "resolved";
    appeal.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appeals));
  }
}

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
