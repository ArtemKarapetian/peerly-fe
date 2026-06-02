import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { useAsync } from "@/shared/lib/useAsync";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { courseRepo } from "@/entities/course";
import type { Course } from "@/entities/course";
import type { Group } from "@/entities/group";

import { useCourseGroups } from "@/features/group/manage-course-groups";
import { ParticipantImportModal } from "@/features/participant/import";

import { GroupsSection } from "./GroupsSection";
import { TeachersSection } from "./TeachersSection";

interface TeacherCourseParticipantsProps {
  courseId: string;
  courseStatus?: Course["status"];
}

export function TeacherCourseParticipants({
  courseId,
  courseStatus,
}: TeacherCourseParticipantsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [importTarget, setImportTarget] = useState<Group | null>(null);

  const {
    groups,
    isLoading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups,
    totalStudents,
    createGroup,
    renameGroup,
    deleteGroup,
    pendingDelete,
    setPendingDelete,
  } = useCourseGroups({ courseId });

  const {
    data: courseParticipants,
    isLoading: courseLoading,
    error: courseError,
    refetch: refetchCourse,
  } = useAsync(() => courseRepo.getParticipants(courseId), [courseId]);

  if (groupsLoading || courseLoading) return <PageSkeleton />;
  if (groupsError) return <ErrorBanner error={groupsError} onRetry={refetchGroups} />;
  if (courseError) return <ErrorBanner error={courseError} onRetry={refetchCourse} />;

  const teachers = courseParticipants?.teachers ?? [];

  const handleCreateHomework = (group: Group) => {
    void navigate(`${ROUTES.teacherCreateAssignment}?courseId=${courseId}&groupId=${group.id}`);
  };

  return (
    <div className="space-y-6">
      <TeachersSection teachers={teachers} />

      <GroupsSection
        groups={groups}
        totalStudents={totalStudents}
        creating={creating}
        locked={courseStatus === "draft" || courseStatus === "archived"}
        onStartCreate={() => setCreating(true)}
        onCancelCreate={() => setCreating(false)}
        onCreateGroup={createGroup}
        onRenameGroup={renameGroup}
        onRequestDelete={setPendingDelete}
        onAddStudents={setImportTarget}
        onCreateHomework={handleCreateHomework}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={t("widget.groups.deleteGroup")}
        description={
          pendingDelete ? t("widget.groups.deleteConfirm", { name: pendingDelete.name }) : undefined
        }
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          const group = pendingDelete;
          setPendingDelete(null);
          void deleteGroup(group);
        }}
      />

      {importTarget && (
        <ParticipantImportModal
          courseId={courseId}
          initialGroupId={importTarget.id}
          lockGroup
          onClose={() => {
            setImportTarget(null);
            refetchGroups();
            // eslint-disable-next-line sonarjs/void-use
            void refetchCourse();
          }}
        />
      )}
    </div>
  );
}
