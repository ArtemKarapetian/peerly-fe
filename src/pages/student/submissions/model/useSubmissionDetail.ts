import { useQuery } from "@tanstack/react-query";

import { type GetSubmittedHomeworkResponse, http } from "@/shared/api";
import { submissionKeys } from "@/shared/api/queryKeys";

export function useSubmissionDetail(submissionId: string | undefined) {
  return useQuery({
    queryKey: submissionKeys.detail(submissionId ?? ""),
    enabled: !!submissionId,
    queryFn: () => http.get<GetSubmittedHomeworkResponse>(`/submissions/${submissionId}`),
  });
}
