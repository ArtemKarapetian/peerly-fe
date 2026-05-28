import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { humanizeApiError } from "@/shared/api";
import { assignmentKeys, courseKeys } from "@/shared/api/queryKeys";

import { assignmentRepo } from "@/entities/assignment";

interface UseDeleteAssignmentArgs {
  assignmentId: string;
  courseId: string;
}

export function useDeleteAssignment({ assignmentId, courseId }: UseDeleteAssignmentArgs) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t("teacher.assignmentDetail.deleteConfirm"))) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      await assignmentRepo.delete(assignmentId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) }),
      ]);
      void navigate(courseId ? `/teacher/courses/${courseId}` : "/teacher/courses");
    } catch (e) {
      console.error("Failed to delete assignment", e);
      setDeleteError(humanizeApiError(e, t("teacher.assignmentDetail.deleteError")));
      setDeleting(false);
    }
  };

  return { deleting, deleteError, handleDelete };
}
