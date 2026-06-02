import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";

import {
  useGroupsByCourse,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
  type Group,
} from "@/entities/group";

interface UseCourseGroupsArgs {
  courseId: string;
}

export interface UseCourseGroupsResult {
  groups: Group[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  totalStudents: number;
  createGroup: (name: string) => Promise<boolean>;
  renameGroup: (group: Group, name: string) => Promise<boolean>;
  deleteGroup: (group: Group) => Promise<boolean>;
  pendingDelete: Group | null;
  setPendingDelete: (group: Group | null) => void;
}

export function useCourseGroups({ courseId }: UseCourseGroupsArgs): UseCourseGroupsResult {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useGroupsByCourse(courseId);
  const { mutateAsync: createMutation } = useCreateGroup(courseId);
  const { mutateAsync: updateMutation } = useUpdateGroup(courseId);
  const { mutateAsync: deleteMutation } = useDeleteGroup(courseId);
  const [pendingDelete, setPendingDelete] = useState<Group | null>(null);

  const groups = useMemo(
    () => [...(data ?? [])].sort((a, b) => a.name.localeCompare(b.name, "ru")),
    [data],
  );
  const totalStudents = useMemo(() => groups.reduce((sum, g) => sum + g.studentCount, 0), [groups]);

  const createGroup = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return false;
      try {
        await createMutation({ courseId, name: trimmed });
        toast.success(t("widget.groups.createSuccess"));
        return true;
      } catch (err) {
        toast.error(humanizeApiError(err, t("widget.groups.createError")));
        return false;
      }
    },
    [courseId, createMutation, t],
  );

  const renameGroup = useCallback(
    async (group: Group, name: string) => {
      const trimmed = name.trim();
      if (!trimmed || trimmed === group.name) return false;
      try {
        await updateMutation({ groupId: group.id, input: { name: trimmed } });
        toast.success(t("widget.groups.renameSuccess"));
        return true;
      } catch (err) {
        toast.error(humanizeApiError(err, t("widget.groups.renameError")));
        return false;
      }
    },
    [updateMutation, t],
  );

  const deleteGroup = useCallback(
    async (group: Group) => {
      try {
        await deleteMutation(group.id);
        toast.success(t("widget.groups.deleteSuccess"));
        return true;
      } catch (err) {
        toast.error(humanizeApiError(err, t("widget.groups.deleteError")));
        return false;
      }
    },
    [deleteMutation, t],
  );

  return {
    groups,
    isLoading,
    error,
    refetch: () => void refetch(),
    totalStudents,
    createGroup,
    renameGroup,
    deleteGroup,
    pendingDelete,
    setPendingDelete,
  };
}
