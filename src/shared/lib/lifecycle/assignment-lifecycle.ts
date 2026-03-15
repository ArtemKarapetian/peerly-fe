/**
 * Assignment Lifecycle State Machine
 *
 * Набросок для фикса, нигде не используется
 */

export type AssignmentPhase =
  | "DRAFT"
  | "PUBLISHED"
  | "SUBMISSION_CLOSED"
  | "REVIEW_OPEN"
  | "REVIEW_CLOSED"
  | "GRADED"
  | "COMPLETED";

export type TransitionTrigger =
  | "publish"
  | "submission_deadline"
  | "distribute_reviews"
  | "review_deadline"
  | "all_reviews_done"
  | "publish_grades"
  | "appeal_window_closes";

export interface PhaseTransition {
  from: AssignmentPhase;
  to: AssignmentPhase;
  trigger: TransitionTrigger;
  auto: boolean;
}

export const TRANSITIONS: PhaseTransition[] = [
  { from: "DRAFT", to: "PUBLISHED", trigger: "publish", auto: false },
  { from: "PUBLISHED", to: "SUBMISSION_CLOSED", trigger: "submission_deadline", auto: true },
  { from: "SUBMISSION_CLOSED", to: "REVIEW_OPEN", trigger: "distribute_reviews", auto: false },
  { from: "REVIEW_OPEN", to: "REVIEW_CLOSED", trigger: "review_deadline", auto: true },
  { from: "REVIEW_OPEN", to: "REVIEW_CLOSED", trigger: "all_reviews_done", auto: true },
  { from: "REVIEW_CLOSED", to: "GRADED", trigger: "publish_grades", auto: false },
  { from: "GRADED", to: "COMPLETED", trigger: "appeal_window_closes", auto: true },
];

export type Role = "teacher" | "student";

export interface PhasePermissions {
  teacher: string[];
  student: string[];
}

export const PHASE_PERMISSIONS: Record<AssignmentPhase, PhasePermissions> = {
  DRAFT: {
    teacher: ["edit", "configure_rubric", "configure_peer_review", "delete"],
    student: [],
  },
  PUBLISHED: {
    teacher: ["edit_limited", "extend_deadline"],
    student: ["view_assignment", "start_work", "submit"],
  },
  SUBMISSION_CLOSED: {
    teacher: ["view_submissions", "extend_deadline", "distribute_reviews"],
    student: ["submit_late"],
  },
  REVIEW_OPEN: {
    teacher: ["moderate", "reassign", "view_progress"],
    student: ["fill_review", "save_draft"],
  },
  REVIEW_CLOSED: {
    teacher: ["review_grades", "adjust_grades"],
    student: [],
  },
  GRADED: {
    teacher: ["view_results", "handle_appeals"],
    student: ["view_grades", "submit_appeal"],
  },
  COMPLETED: {
    teacher: ["archive"],
    student: ["view_final_grades"],
  },
};

/** Ordered list of phases for progress display */
export const PHASE_ORDER: AssignmentPhase[] = [
  "DRAFT",
  "PUBLISHED",
  "SUBMISSION_CLOSED",
  "REVIEW_OPEN",
  "REVIEW_CLOSED",
  "GRADED",
  "COMPLETED",
];

export const PHASE_LABELS: Record<AssignmentPhase, string> = {
  DRAFT: "Черновик",
  PUBLISHED: "Опубликовано",
  SUBMISSION_CLOSED: "Приём закрыт",
  REVIEW_OPEN: "Рецензирование",
  REVIEW_CLOSED: "Рецензии закрыты",
  GRADED: "Оценки выставлены",
  COMPLETED: "Завершено",
};

// --- Sub-entity states ---

export type SubmissionStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "late_submitted"
  | "reviewed";

export type ReviewStatus = "pending" | "draft" | "submitted";

export type AppealStatus = "new" | "in_review" | "approved" | "denied" | "adjusted";

// --- Helpers ---

export function getNextTransitions(phase: AssignmentPhase): PhaseTransition[] {
  return TRANSITIONS.filter((t) => t.from === phase);
}

export function canTransition(
  current: AssignmentPhase,
  trigger: TransitionTrigger,
): AssignmentPhase | null {
  const transition = TRANSITIONS.find((t) => t.from === current && t.trigger === trigger);
  return transition?.to ?? null;
}

export function getPhaseIndex(phase: AssignmentPhase): number {
  return PHASE_ORDER.indexOf(phase);
}

export function hasPermission(phase: AssignmentPhase, role: Role, action: string): boolean {
  return PHASE_PERMISSIONS[phase][role].includes(action);
}
