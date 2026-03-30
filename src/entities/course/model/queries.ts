import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { courseKeys } from "@/shared/api/queryKeys";

import { courseRepo } from "..";

import type { CreateCourseInput } from "./types";

export function useCourses() {
  return useQuery({
    queryKey: courseKeys.lists(),
    queryFn: () => courseRepo.getAll(),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseRepo.getById(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCourseInput) => courseRepo.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}

export function useArchiveCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, archived }: { courseId: string; archived: boolean }) =>
      courseRepo.archive(courseId, archived),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}
