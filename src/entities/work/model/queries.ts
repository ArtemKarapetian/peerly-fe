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

export function useAllSubmissions() {
  return useQuery({
    queryKey: submissionKeys.lists(),
    queryFn: () => workRepo.getAll(),
  });
}

export function useHomeworkSubmissions(homeworkId: string) {
  return useQuery({
    queryKey: submissionKeys.forHomework(homeworkId),
    queryFn: () => workRepo.listForHomework(homeworkId),
    enabled: !!homeworkId,
  });
}

export function useSubmission(submissionId: string) {
  return useQuery({
    queryKey: submissionKeys.detail(submissionId),
    queryFn: () => workRepo.getById(submissionId),
    enabled: !!submissionId,
  });
}
