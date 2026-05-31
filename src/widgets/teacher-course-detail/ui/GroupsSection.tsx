import { Lock, Plus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/shared/ui";

import type { DemoGroup } from "@/entities/group";

import { CreateGroupForm, GroupRow } from "@/features/group/manage-course-groups";

interface GroupsSectionProps {
  groups: DemoGroup[];
  totalStudents: number;
  creating: boolean;
  locked: boolean;
  onStartCreate: () => void;
  onCancelCreate: () => void;
  onCreateGroup: (name: string) => Promise<boolean>;
  onRenameGroup: (group: DemoGroup, name: string) => Promise<boolean>;
  onRequestDelete: (group: DemoGroup) => void;
  onAddStudents: (group: DemoGroup) => void;
  onCreateHomework: (group: DemoGroup) => void;
}

export function GroupsSection({
  groups,
  totalStudents,
  creating,
  locked,
  onStartCreate,
  onCancelCreate,
  onCreateGroup,
  onRenameGroup,
  onRequestDelete,
  onAddStudents,
  onCreateHomework,
}: GroupsSectionProps) {
  const { t } = useTranslation();
  return (
    <section>
      <GroupsHeader
        groupsCount={groups.length}
        totalStudents={totalStudents}
        showCreateButton={!creating && !locked}
        onStartCreate={onStartCreate}
      />

      {locked && (
        <div className="flex items-start gap-3 bg-warning-light border border-warning rounded-md p-4 mb-3">
          <Lock className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <p className="text-13 text-foreground">{t("widget.groups.lockedHint")}</p>
        </div>
      )}

      {creating && !locked && (
        <CreateGroupForm
          onSubmit={async (name) => {
            const ok = await onCreateGroup(name);
            if (ok) onCancelCreate();
          }}
          onCancel={onCancelCreate}
        />
      )}

      {groups.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t("widget.groups.emptyTitle")}
          message={t("widget.groups.empty")}
          action={
            !locked &&
            !creating && (
              <button
                onClick={onStartCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-inverse rounded-md hover:bg-brand-primary-hover transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {t("widget.groups.createGroup")}
              </button>
            )
          }
          className="border-2 border-dashed border-border rounded-md"
        />
      ) : (
        <ul className="space-y-2">
          {groups.map((group) => (
            <GroupRow
              key={group.id}
              group={group}
              onRename={onRenameGroup}
              onDelete={onRequestDelete}
              onAddStudents={onAddStudents}
              onCreateHomework={onCreateHomework}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

interface GroupsHeaderProps {
  groupsCount: number;
  totalStudents: number;
  showCreateButton: boolean;
  onStartCreate: () => void;
}

function GroupsHeader({
  groupsCount,
  totalStudents,
  showCreateButton,
  onStartCreate,
}: GroupsHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
      <h3 className="text-13 font-medium text-muted-foreground uppercase tracking-wide">
        {t("widget.participants.groupsSection")}{" "}
        <span className="text-foreground tabular-nums">
          · {groupsCount} · {t("widget.groups.studentsCount", { count: totalStudents })}
        </span>
      </h3>
      {showCreateButton && (
        <button
          onClick={onStartCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-inverse rounded-md hover:bg-brand-primary-hover transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          {t("widget.groups.createGroup")}
        </button>
      )}
    </div>
  );
}
