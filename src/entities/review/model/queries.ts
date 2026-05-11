import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reviewKeys } from "@/shared/api/queryKeys";

import { reviewHttpRepo } from "../api/httpRepo";

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

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      mark,
      comment,
    }: {
      submissionId: string;
      mark: number;
      comment: string;
    }) => reviewHttpRepo.create(submissionId, mark, comment),
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: ["assigned-reviews", "submission", vars.submissionId],
      });
      void queryClient.invalidateQueries({ queryKey: ["assigned-reviews", "me"] });
    },
  });
}
