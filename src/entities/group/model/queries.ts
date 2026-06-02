import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { groupKeys } from "@/shared/api/queryKeys";

import { groupHttpRepo as groupRepo } from "../api/httpRepo";

import type { CreateGroupInput, UpdateGroupInput } from "./types";

export function useGroupsByCourse(courseId: string) {
  return useQuery({
    queryKey: groupKeys.list(courseId),
    queryFn: () => groupRepo.listForCourse(courseId),
    enabled: !!courseId,
  });
}

export function useGroupParticipants(groupId: string, enabled = true) {
  return useQuery({
    queryKey: groupKeys.participants(groupId),
    queryFn: () => groupRepo.getParticipants(groupId),
    enabled: enabled && !!groupId,
  });
}

export function useCreateGroup(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGroupInput) => groupRepo.create(input),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: groupKeys.list(courseId) });
    },
  });
}

export function useUpdateGroup(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, input }: { groupId: string; input: UpdateGroupInput }) =>
      groupRepo.update(groupId, input),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: groupKeys.list(courseId) });
    },
  });
}

export function useDeleteGroup(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => groupRepo.delete(groupId),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: groupKeys.list(courseId) });
    },
  });
}
