import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reviewKeys } from "@/shared/api/queryKeys";

import { reviewHttpRepo } from "../api/httpRepo";

import type { CriterionScore } from "./types";

export function useAssignedSubmission(submissionId: string) {
  return useQuery({
    queryKey: ["assigned-reviews", "submission", submissionId],
    queryFn: () => reviewHttpRepo.getAssignedSubmission(submissionId),
    enabled: !!submissionId,
  });
}

export function useSubmittedReview(reviewId: string | null) {
  return useQuery({
    queryKey: reviewKeys.detail(reviewId ?? ""),
    queryFn: () => reviewHttpRepo.getById(reviewId!),
    enabled: !!reviewId,
  });
}

export interface SubmitReviewInput {
  submissionId: string;
  scores: CriterionScore[];
  comment: string;
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, scores, comment }: SubmitReviewInput) =>
      reviewHttpRepo.create(submissionId, scores, comment),
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: ["assigned-reviews", "submission", vars.submissionId],
      });
      void queryClient.invalidateQueries({ queryKey: ["assigned-reviews", "me"] });
    },
  });
}
