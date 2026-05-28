import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { useAsync } from "@/shared/lib/useAsync";

import { groupRepo, type DemoGroup } from "@/entities/group";

interface UseCourseGroupsArgs {
  courseId: string;
}

export interface UseCourseGroupsResult {
  groups: DemoGroup[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  totalStudents: number;
  createGroup: (name: string) => Promise<boolean>;
  renameGroup: (group: DemoGroup, name: string) => Promise<boolean>;
  deleteGroup: (group: DemoGroup) => Promise<boolean>;
  pendingDelete: DemoGroup | null;
  setPendingDelete: (group: DemoGroup | null) => void;
}

export function useCourseGroups({ courseId }: UseCourseGroupsArgs): UseCourseGroupsResult {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useAsync(
    () => groupRepo.listForCourse(courseId),
    [courseId],
  );
  const [pendingDelete, setPendingDelete] = useState<DemoGroup | null>(null);

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
        await groupRepo.create({ courseId, name: trimmed });
        toast.success(t("widget.groups.createSuccess"));
        refetch();
        return true;
      } catch (err) {
        toast.error(humanizeApiError(err, t("widget.groups.createError")));
        return false;
      }
    },
    [courseId, refetch, t],
  );

  const renameGroup = useCallback(
    async (group: DemoGroup, name: string) => {
      const trimmed = name.trim();
      if (!trimmed || trimmed === group.name) return false;
      try {
        await groupRepo.update(group.id, { name: trimmed });
        toast.success(t("widget.groups.renameSuccess"));
        refetch();
        return true;
      } catch (err) {
        toast.error(humanizeApiError(err, t("widget.groups.renameError")));
        return false;
      }
    },
    [refetch, t],
  );

  const deleteGroup = useCallback(
    async (group: DemoGroup) => {
      try {
        await groupRepo.delete(group.id);
        toast.success(t("widget.groups.deleteSuccess"));
        refetch();
        return true;
      } catch (err) {
        toast.error(humanizeApiError(err, t("widget.groups.deleteError")));
        return false;
      }
    },
    [refetch, t],
  );

  return {
    groups,
    isLoading,
    error,
    refetch,
    totalStudents,
    createGroup,
    renameGroup,
    deleteGroup,
    pendingDelete,
    setPendingDelete,
  };
}
