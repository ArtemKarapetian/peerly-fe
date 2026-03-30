/**
 * Centralized query key factory.
 *
 * Convention: each entity exports an object with key builders.
 * This enables targeted invalidation, e.g.:
 *   queryClient.invalidateQueries({ queryKey: courseKeys.all })
 *   queryClient.invalidateQueries({ queryKey: courseKeys.detail("c1") })
 */

export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
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

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
