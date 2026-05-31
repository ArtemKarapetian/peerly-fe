export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  participants: (courseId: string) => [...courseKeys.detail(courseId), "participants"] as const,
};

export const assignmentKeys = {
  all: ["assignments"] as const,
  lists: () => [...assignmentKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...assignmentKeys.lists(), filters] as const,
  details: () => [...assignmentKeys.all, "detail"] as const,
  detail: (id: string) => [...assignmentKeys.details(), id] as const,
};

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...reviewKeys.lists(), filters] as const,
  details: () => [...reviewKeys.all, "detail"] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
};

export const rubricKeys = {
  all: ["rubrics"] as const,
  lists: () => [...rubricKeys.all, "list"] as const,
  list: () => [...rubricKeys.lists(), "mine"] as const,
  details: () => [...rubricKeys.all, "detail"] as const,
  detail: (id: string) => [...rubricKeys.details(), id] as const,
};

export const submissionKeys = {
  all: ["submissions"] as const,
  mine: (homeworkId: string) => [...submissionKeys.all, "mine", homeworkId] as const,
  mineId: (homeworkId: string) => [...submissionKeys.all, "mine-id", homeworkId] as const,
  detail: (submissionId: string) => [...submissionKeys.all, "detail", submissionId] as const,
};

export const assignedReviewKeys = {
  all: ["assigned-reviews"] as const,
  forMe: () => [...assignedReviewKeys.all, "me"] as const,
  submission: (submissionId: string) =>
    [...assignedReviewKeys.all, "submission", submissionId] as const,
};

export const receivedReviewKeys = {
  all: ["received-reviews"] as const,
  forMe: () => [...receivedReviewKeys.all, "me"] as const,
};

export const gradebookKeys = {
  all: ["gradebook"] as const,
  forMe: () => [...gradebookKeys.all, "me"] as const,
};
