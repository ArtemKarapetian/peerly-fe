import { useQuery } from "@tanstack/react-query";

import { submissionKeys } from "@/shared/api/queryKeys";

import { workHttpRepo as workRepo } from "../api/httpRepo";

export function useMySubmission(homeworkId: string) {
  return useQuery({
    queryKey: submissionKeys.mine(homeworkId),
    queryFn: () => workRepo.getMineForHomework(homeworkId),
    enabled: !!homeworkId,
  });
}
