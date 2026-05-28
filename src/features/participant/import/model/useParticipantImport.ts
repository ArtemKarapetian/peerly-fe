import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { humanizeApiError } from "@/shared/api";
import { courseKeys } from "@/shared/api/queryKeys";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

import { courseRepo } from "@/entities/course";
import { groupRepo } from "@/entities/group";
import { userRepo } from "@/entities/user";

import { addStudentsToGroup } from "./addStudents";

interface StudentRow {
  id: string;
  name: string;
  email: string;
}

interface GroupRow {
  id: string;
  name: string;
}

export interface AddResult {
  added: number;
  failed: number;
  successMessage: string | null;
  errorMessage: string | null;
}

export interface UseParticipantImportResult {
  query: string;
  setQuery: (q: string) => void;
  groups: GroupRow[];
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
  candidates: StudentRow[];
  selectedIds: Set<string>;
  toggleSelected: (id: string) => void;
  isSearching: boolean;
  isAdding: boolean;
  loadError: string;
  hasQuery: boolean;
  add: () => Promise<AddResult | null>;
  canSubmit: boolean;
}

export function useParticipantImport(
  courseId: string,
  initialGroupId?: string,
): UseParticipantImportResult {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(initialGroupId ?? "");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [alreadyInCourse, setAlreadyInCourse] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([groupRepo.listForCourse(courseId), courseRepo.getParticipants(courseId)])
      .then(([gs, participants]) => {
        if (cancelled) return;
        setGroups(gs.map((g) => ({ id: g.id, name: g.name })));
        setSelectedGroupId((prev) => prev || initialGroupId || gs[0]?.id || "");
        setAlreadyInCourse(new Set(participants.students.map((s) => String(s.studentId))));
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(humanizeApiError(err, t("feature.participantImport.loadError")));
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, initialGroupId, t]);

  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      setStudents([]);
      setIsSearching(false);
      return;
    }
    let cancelled = false;
    const run = async () => {
      setIsSearching(true);
      try {
        const res = await userRepo.searchStudents(debouncedQuery);
        if (!cancelled) setStudents(res);
      } catch {
        if (!cancelled) setStudents([]);
      } finally {
        if (!cancelled) setIsSearching(false);
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

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const add: UseParticipantImportResult["add"] = async () => {
    if (!selectedGroupId || selectedIds.size === 0) return null;
    setIsAdding(true);
    const { added, failed, firstFailure } = await addStudentsToGroup(
      selectedGroupId,
      Array.from(selectedIds),
      groupRepo.addStudent,
    );
    setIsAdding(false);
    if (added > 0) {
      void queryClient.invalidateQueries({ queryKey: courseKeys.participants(courseId) });
    }
    return {
      added,
      failed,
      successMessage:
        added > 0 ? t("feature.participantImport.addedCount", { count: added }) : null,
      errorMessage:
        failed > 0 ? humanizeApiError(firstFailure, t("feature.participantImport.addError")) : null,
    };
  };

  return {
    query,
    setQuery,
    groups,
    selectedGroupId,
    setSelectedGroupId,
    candidates,
    selectedIds,
    toggleSelected,
    isSearching,
    isAdding,
    loadError,
    hasQuery: debouncedQuery.trim().length >= 3,
    add,
    canSubmit: Boolean(selectedGroupId) && selectedIds.size > 0 && !isAdding,
  };
}
