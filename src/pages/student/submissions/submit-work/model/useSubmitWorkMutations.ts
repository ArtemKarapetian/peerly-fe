import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { assignmentKeys, submissionKeys } from "@/shared/api/queryKeys";

import { storageApi } from "@/entities/storage";
import { workRepo } from "@/entities/work";

import { commentForBe } from "../lib/formatters";

interface UseSubmitWorkMutationsArgs {
  taskId: string;
  submissionId: string | undefined;
  comment: string;
  onError: (message: string) => void;
}

export function useSubmitWorkMutations({
  taskId,
  submissionId,
  comment,
  onError,
}: UseSubmitWorkMutationsArgs) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const refreshSubmission = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: submissionKeys.all }),
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(taskId) }),
    ]);

  const ensureSubmission = async (): Promise<string> => {
    if (submissionId) return submissionId;
    const { submissionId: created } = await workRepo.create(taskId, commentForBe(comment));
    await refreshSubmission();
    return created;
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const existedBefore = !!submissionId;
      const id = await ensureSubmission();
      try {
        await storageApi.upload(file, { kind: "submission", submissionId: id });
      } catch (err) {
        if (!existedBefore) {
          try {
            await workRepo.delete(id);
          } catch {}
          await refreshSubmission();
        }
        throw err;
      }
    },
    onSuccess: () => refreshSubmission(),
    onError: () => onError(t("page.submitWork.uploadError")),
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      if (!submissionId) return;
      await storageApi.deleteSubmissionFile(submissionId, fileId);
    },
    onSuccess: () => refreshSubmission(),
    onError: () => onError(t("page.submitWork.deleteFileError")),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (submissionId) {
        await workRepo.update(submissionId, commentForBe(comment));
      } else {
        await workRepo.create(taskId, commentForBe(comment));
      }
    },
    onSuccess: async () => {
      await refreshSubmission();
      toast.success(t("page.submitWork.draftSaved"));
    },
    onError: () => onError(t("page.submitWork.saveError")),
  });

  return { uploadMutation, deleteFileMutation, saveMutation };
}
