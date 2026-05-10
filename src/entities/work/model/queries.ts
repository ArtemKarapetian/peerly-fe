import { useQuery } from "@tanstack/react-query";

import { workRepo } from "..";

export function useMySubmission(homeworkId: string) {
  return useQuery({
    queryKey: ["submissions", "mine", homeworkId],
    queryFn: () => workRepo.getMineForHomework(homeworkId),
    enabled: !!homeworkId,
  });
}
