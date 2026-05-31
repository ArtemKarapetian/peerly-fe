import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { rubricKeys } from "@/shared/api/queryKeys";

import { rubricHttpRepo } from "../api/httpRepo";

import type { RubricInput } from "./types";

export function useRubrics() {
  return useQuery({
    queryKey: rubricKeys.list(),
    queryFn: () => rubricHttpRepo.listMine(),
  });
}

export function useRubric(rubricId: string | undefined) {
  return useQuery({
    queryKey: rubricKeys.detail(rubricId ?? ""),
    queryFn: () => rubricHttpRepo.getById(rubricId!),
    enabled: Boolean(rubricId),
  });
}

export function useCreateRubric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RubricInput) => rubricHttpRepo.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rubricKeys.lists() }),
  });
}

export function useUpdateRubric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rubricId, input }: { rubricId: string; input: RubricInput }) =>
      rubricHttpRepo.update(rubricId, input),
    onSuccess: (_data, { rubricId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: rubricKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: rubricKeys.detail(rubricId) }),
      ]),
  });
}

export function useDeleteRubric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rubricId: string) => rubricHttpRepo.delete(rubricId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rubricKeys.lists() }),
  });
}
