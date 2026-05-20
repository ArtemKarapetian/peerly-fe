import { X, Search, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

import { courseRepo } from "@/entities/course";
import { groupRepo } from "@/entities/group";
import { userRepo } from "@/entities/user";

import { addStudentsToGroup } from "../model/addStudents";

interface ParticipantImportModalProps {
  courseId: string;
  onClose: () => void;
}

interface StudentRow {
  id: string;
  name: string;
  email: string;
}

export function ParticipantImportModal({ courseId, onClose }: ParticipantImportModalProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [alreadyInCourse, setAlreadyInCourse] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([groupRepo.listForCourse(courseId), courseRepo.getParticipants(courseId)])
      .then(([gs, participants]) => {
        if (cancelled) return;
        setGroups(gs.map((g) => ({ id: g.id, name: g.name })));
        setSelectedGroupId((prev) => prev || gs[0]?.id || "");
        setAlreadyInCourse(new Set(participants.students.map((s) => String(s.studentId))));
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(humanizeApiError(err, t("feature.participantImport.loadError")));
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, t]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      try {
        const res = await userRepo.searchStudents(debouncedQuery);
        if (!cancelled) setStudents(res);
      } catch {
        if (!cancelled) setStudents([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const candidates = useMemo(
    () => students.filter((s) => !alreadyInCourse.has(s.id)),
    [students, alreadyInCourse],
  );

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = async () => {
    if (!selectedGroupId || selectedIds.size === 0) return;
    setIsAdding(true);
    const { added, failed, firstFailure } = await addStudentsToGroup(
      selectedGroupId,
      Array.from(selectedIds),
      groupRepo.addStudent,
    );
    setIsAdding(false);

    if (added > 0) {
      toast.success(t("feature.participantImport.addedCount", { count: added }));
    }
    if (failed > 0) {
      toast.error(humanizeApiError(firstFailure, t("feature.participantImport.addError")));
    }
    if (added > 0) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-[20px] w-full max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b-2 border-border">
          <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px]">
            {t("feature.participantImport.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-[8px] transition-colors"
            aria-label={t("feature.participantImport.close")}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {loadError ? (
          <div className="flex items-center gap-2 m-6 p-4 bg-error-light text-destructive rounded-[12px]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-[14px]">{loadError}</span>
          </div>
        ) : null}

        <div className="p-6 space-y-4 border-b-2 border-border">
          <div>
            <label className="block text-[13px] font-medium text-foreground mb-2">
              {t("feature.participantImport.targetGroup")}
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              disabled={groups.length === 0}
              className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] bg-card focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
            >
              {groups.length === 0 ? (
                <option>{t("feature.participantImport.noGroups")}</option>
              ) : (
                groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-foreground mb-2">
              {t("feature.participantImport.searchLabel")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("feature.participantImport.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <p className="text-[14px] text-muted-foreground text-center py-8">
              {t("common.loading")}
            </p>
          ) : candidates.length === 0 ? (
            <p className="text-[14px] text-muted-foreground text-center py-8">
              {debouncedQuery
                ? t("feature.participantImport.noResults")
                : t("feature.participantImport.startTyping")}
            </p>
          ) : (
            <ul className="space-y-2">
              {candidates.map((s) => {
                const checked = selectedIds.has(s.id);
                return (
                  <li key={s.id}>
                    <label
                      className={`flex items-center gap-3 p-3 border-2 rounded-[12px] cursor-pointer transition-colors ${
                        checked
                          ? "border-brand-primary bg-brand-primary-lighter"
                          : "border-border hover:bg-surface-hover"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(s.id)}
                        className="w-4 h-4 accent-brand-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-foreground truncate">
                          {s.name || s.email}
                        </p>
                        {s.name ? (
                          <p className="text-[12px] text-muted-foreground truncate">{s.email}</p>
                        ) : null}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-6 border-t-2 border-border">
          <p className="text-[13px] text-muted-foreground">
            {t("feature.participantImport.selectedCount", { count: selectedIds.size })}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-[12px] transition-colors"
            >
              {t("feature.participantImport.cancel")}
            </button>
            <button
              onClick={() => void handleAdd()}
              disabled={!selectedGroupId || selectedIds.size === 0 || isAdding}
              className="px-6 py-2 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isAdding
                ? t("common.saving")
                : t("feature.participantImport.addBtn", { count: selectedIds.size })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
