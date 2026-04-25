// Черновики рецензий в localStorage

import { ReviewDraft } from "@/entities/review/model/types.ts";

import type { CriterionScore } from "@/features/review";

export function getDraftKey(courseId: string, taskId: string, reviewId: string): string {
  return `review_draft_${courseId}_${taskId}_${reviewId}`;
}

export function saveDraftToStorage(
  courseId: string,
  taskId: string,
  reviewId: string,
  scores: CriterionScore[],
  overallComment: string,
): boolean {
  try {
    const draft: ReviewDraft = {
      scores,
      overallComment,
      lastSaved: Date.now(),
    };
    const key = getDraftKey(courseId, taskId, reviewId);
    localStorage.setItem(key, JSON.stringify(draft));
    return true;
  } catch (error) {
    console.error("Failed to save draft to localStorage:", error);
    return false;
  }
}

export function loadDraftFromStorage(
  courseId: string,
  taskId: string,
  reviewId: string,
): ReviewDraft | null {
  try {
    const key = getDraftKey(courseId, taskId, reviewId);
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as ReviewDraft;
  } catch (error) {
    console.error("Failed to load draft from localStorage:", error);
    return null;
  }
}

export function clearDraftFromStorage(courseId: string, taskId: string, reviewId: string): void {
  try {
    const key = getDraftKey(courseId, taskId, reviewId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear draft from localStorage:", error);
  }
}

export { formatSaveTime } from "@/shared/lib/formatSaveTime.ts";
