import { useQuery } from "@tanstack/react-query";

import { assignmentKeys } from "@/shared/api/queryKeys";

import { assignmentRepo } from "..";

export function useAssignments() {
  return useQuery({
    queryKey: assignmentKeys.lists(),
    queryFn: () => assignmentRepo.getAll(),
  });
}

export function useAssignmentsByCourse(courseId: string) {
  return useQuery({
    queryKey: assignmentKeys.list({ courseId }),
    queryFn: () => assignmentRepo.getByCourse(courseId),
    enabled: !!courseId,
  });
}

export function useAssignment(homeworkId: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(homeworkId),
    queryFn: () => assignmentRepo.getById(homeworkId),
    enabled: !!homeworkId,
  });
}

export function useTeacherAssignmentDetail(homeworkId: string) {
  return useQuery({
    queryKey: [...assignmentKeys.detail(homeworkId), "teacher-detail"],
    queryFn: () => assignmentRepo.getTeacherDetail(homeworkId),
    enabled: !!homeworkId,
  });
}
