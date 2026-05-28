import { isValidDate } from "@/features/assignment/create/lib/validateDeadlines";
import type { AssignmentFormData } from "@/features/assignment/create/model/types";

export const STORAGE_KEY = "peerly_assignment_draft";

export interface DraftPayload {
  formData: AssignmentFormData;
  currentStep: number;
}

function parseStoredDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return isValidDate(parsed) ? parsed : null;
}

export function blankFormData(): AssignmentFormData {
  return {
    courseId: "",
    groupId: null,
    title: "",
    description: "",
    submissionDeadline: null,
    reviewDeadline: null,
    rubricId: null,
    reviewsPerSubmission: 3,
    discrepancyThreshold: 2,
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

interface StoredDraftV2 {
  formData: Omit<
    AssignmentFormData,
    "submissionDeadline" | "reviewDeadline" | "createdAt" | "updatedAt"
  > & {
    submissionDeadline: string | null;
    reviewDeadline: string | null;
    createdAt: string;
    updatedAt: string;
  };
  currentStep: number;
}

type StoredDraftV1 = StoredDraftV2["formData"];

function isV2(raw: unknown): raw is StoredDraftV2 {
  return (
    typeof raw === "object" &&
    raw !== null &&
    "formData" in raw &&
    "currentStep" in raw &&
    typeof (raw as StoredDraftV2).currentStep === "number"
  );
}

function hydrateFormData(stored: StoredDraftV1): AssignmentFormData {
  const createdAt = parseStoredDate(stored.createdAt) ?? new Date();
  const updatedAt = parseStoredDate(stored.updatedAt) ?? new Date();
  return {
    ...stored,
    groupId: stored.groupId ?? null,
    discrepancyThreshold: stored.discrepancyThreshold ?? 2,
    submissionDeadline: parseStoredDate(stored.submissionDeadline),
    reviewDeadline: parseStoredDate(stored.reviewDeadline),
    createdAt,
    updatedAt,
  };
}

export function loadDraftFromStorage(): DraftPayload | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed: unknown = JSON.parse(stored);
    if (isV2(parsed)) {
      return {
        formData: hydrateFormData(parsed.formData),
        currentStep:
          Number.isInteger(parsed.currentStep) && parsed.currentStep >= 1 ? parsed.currentStep : 1,
      };
    }
    return {
      formData: hydrateFormData(parsed as StoredDraftV1),
      currentStep: 1,
    };
  } catch (e) {
    console.error("Failed to parse assignment draft", e);
    return null;
  }
}

export function saveDraft(formData: AssignmentFormData, currentStep: number): void {
  const payload: StoredDraftV2 = {
    formData: {
      ...formData,
      submissionDeadline: formData.submissionDeadline
        ? formData.submissionDeadline.toISOString()
        : null,
      reviewDeadline: formData.reviewDeadline ? formData.reviewDeadline.toISOString() : null,
      createdAt: formData.createdAt.toISOString(),
      updatedAt: formData.updatedAt.toISOString(),
    },
    currentStep,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearDraftStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
