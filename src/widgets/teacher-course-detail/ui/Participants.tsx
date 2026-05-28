import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { courseRepo } from "@/entities/course";
import type { DemoGroup } from "@/entities/group";

import { CreateGroupForm, GroupRow, useCourseGroups } from "@/features/group/manage-course-groups";
import { ParticipantImportModal } from "@/features/participant/import";

interface TeacherCourseParticipantsProps {
  courseId: string;
}

export function TeacherCourseParticipants({ courseId }: TeacherCourseParticipantsProps) {
  const { t } = useTranslation();
  const [creating, setCreating] = useState(false);
  const [importTarget, setImportTarget] = useState<DemoGroup | null>(null);

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

  return (
    <div className="space-y-6">
      {teachers.length > 0 && (
        <section>
          <h3 className="text-13 font-medium text-muted-foreground uppercase tracking-wide mb-3">
            {t("widget.participants.teachersSection")}
          </h3>
          <ul className="space-y-1">
            {teachers.map((teacher) => (
              <li
                key={teacher.teacherId}
                className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/30"
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-warning-light text-warning text-xs font-medium shrink-0">
                  {teacher.name.charAt(0)}
                </span>
                <span className="text-sm font-medium text-foreground">{teacher.name}</span>
                {teacher.email ? (
                  <span className="text-13 text-muted-foreground truncate">{teacher.email}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <h3 className="text-13 font-medium text-muted-foreground uppercase tracking-wide">
            {t("widget.participants.groupsSection")}{" "}
            <span className="text-foreground tabular-nums">
              · {groups.length} · {t("widget.groups.studentsCount", { count: totalStudents })}
            </span>
          </h3>
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-inverse rounded-md hover:bg-brand-primary-hover transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              {t("widget.groups.createGroup")}
            </button>
          ) : null}
        </div>

        {creating && (
          <CreateGroupForm
            onSubmit={async (name) => {
              const ok = await createGroup(name);
              if (ok) setCreating(false);
            }}
            onCancel={() => setCreating(false)}
          />
        )}

        {groups.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-md">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-15 text-muted-foreground">{t("widget.groups.empty")}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {groups.map((g) => (
              <GroupRow
                key={g.id}
                group={g}
                onRename={renameGroup}
                onDelete={(grp) => setPendingDelete(grp)}
                onAddStudents={(grp) => setImportTarget(grp)}
              />
            ))}
          </ul>
        )}
      </section>

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
          const g = pendingDelete;
          setPendingDelete(null);
          void deleteGroup(g);
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
            void refetchCourse();
          }}
        />
      )}
    </div>
  );
}
