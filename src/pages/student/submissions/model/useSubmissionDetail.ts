import { useQuery } from "@tanstack/react-query";

import { type GetSubmittedHomeworkResponse, http } from "@/shared/api";

export function useSubmissionDetail(submissionId: string | undefined) {
  return useQuery({
    queryKey: ["submissions", submissionId, "detail"],
    enabled: !!submissionId,
    queryFn: () => http.get<GetSubmittedHomeworkResponse>(`/submissions/${submissionId}`),
  });
}
