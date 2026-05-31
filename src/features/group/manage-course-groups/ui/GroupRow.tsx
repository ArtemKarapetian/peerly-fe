import {
  Check,
  ChevronDown,
  ChevronRight,
  FileCheck,
  Pencil,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { TextField } from "@/shared/ui";

import { groupRepo, type Group } from "@/entities/group";

interface GroupRowProps {
  group: Group;
  onRename: (group: Group, newName: string) => void | Promise<unknown>;
  onDelete: (group: Group) => void;
  onAddStudents: (group: Group) => void;
  onCreateHomework?: (group: Group) => void;
}

export function GroupRow({
  group,
  onRename,
  onDelete,
  onAddStudents,
  onCreateHomework,
}: GroupRowProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(group.name);

  const {
    data: participants,
    isLoading,
    error,
  } = useAsync(
    () => (expanded ? groupRepo.getParticipants(group.id) : Promise.resolve(null)),
    [expanded, group.id],
  );

  const cancelRename = () => {
    setRenaming(false);
    setDraft(group.name);
  };

  const submitRename = () => {
    const next = draft.trim();
    if (!next || next === group.name) {
      cancelRename();
      return;
    }
    setRenaming(false);
    void onRename(group, next);
  };

  return (
    <li className="border-2 border-border rounded-md overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        {renaming ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {expanded ? (
              <ChevronDown className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )}
            <TextField
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename();
                if (e.key === "Escape") cancelRename();
              }}
              className="px-2 py-1 w-auto flex-1"
            />
            <button
              type="button"
              onClick={submitRename}
              title={t("widget.groups.saveRename")}
              aria-label={t("widget.groups.saveRename")}
              className="p-1 hover:bg-success-light rounded-sm text-success"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={cancelRename}
              title={t("widget.groups.cancelRename")}
              aria-label={t("widget.groups.cancelRename")}
              className="p-1 hover:bg-surface-hover rounded-sm text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 flex-1 text-left hover:text-brand-primary transition-colors min-w-0"
            aria-expanded={expanded}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )}
            <span className="text-base font-medium text-foreground truncate">{group.name}</span>
            <span className="text-13 text-muted-foreground tabular-nums shrink-0">
              · {t("widget.groups.studentsCount", { count: group.studentCount })}
            </span>
          </button>
        )}
        {onCreateHomework ? (
          <button
            onClick={() => onCreateHomework(group)}
            title={t("widget.groups.createHomework")}
            aria-label={t("widget.groups.createHomework")}
            className="p-2 hover:bg-surface-hover rounded-sm transition-colors text-muted-foreground"
          >
            <FileCheck className="w-4 h-4" />
          </button>
        ) : null}
        <button
          onClick={() => onAddStudents(group)}
          title={t("widget.groups.addStudents")}
          aria-label={t("widget.groups.addStudents")}
          className="p-2 hover:bg-surface-hover rounded-sm transition-colors text-muted-foreground"
        >
          <UserPlus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setDraft(group.name);
            setRenaming(true);
          }}
          title={t("widget.groups.rename")}
          aria-label={t("widget.groups.rename")}
          className="p-2 hover:bg-surface-hover rounded-sm transition-colors text-muted-foreground"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(group)}
          title={t("widget.groups.deleteGroup")}
          aria-label={t("widget.groups.deleteGroup")}
          className="p-2 hover:bg-error-light rounded-sm transition-colors text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {expanded && (
        <div className="border-t-2 border-border bg-muted/30 p-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : error ? (
            <p className="text-sm text-destructive">{t("widget.groups.loadStudentsError")}</p>
          ) : !participants || participants.students.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("widget.groups.noStudents")}</p>
          ) : (
            <ul className="space-y-1">
              {participants.students.map((s) => (
                <li key={s.id} className="text-sm text-foreground">
                  {s.name}
                  {s.email ? <span className="text-muted-foreground"> ({s.email})</span> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}
