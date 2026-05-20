import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateCourseRequestBody } from "@/shared/api";
import { courseKeys } from "@/shared/api/queryKeys";

import { courseRepo } from "..";

import type { CreateCourseInput } from "./types";

export function useCourseParticipants(courseId: string) {
  return useQuery({
    queryKey: courseKeys.participants(courseId),
    queryFn: () => courseRepo.getParticipants(courseId),
    enabled: !!courseId,
  });
}

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

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateCourseRequestBody) => courseRepo.update(courseId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      void queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}
