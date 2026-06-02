import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { RubricEditorCriterion, RubricEditorData } from "./types";

export function useRubricForm(initial: RubricEditorData, onSave: (r: RubricEditorData) => void) {
  const { t } = useTranslation();
  const [edited, setEdited] = useState<RubricEditorData>(initial);
  const [isDirty, setIsDirty] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleSave = () => {
    const withPositions: RubricEditorData = {
      ...edited,
      criteria: edited.criteria.map((c, i) => ({ ...c, position: i })),
    };
    onSave(withPositions);
    setIsDirty(false);
  };

  const updateRubric = (updates: Partial<RubricEditorData>) => {
    setEdited((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const updateCriterion = (index: number, updates: Partial<RubricEditorCriterion>) => {
    setEdited((prev) => {
      const next = [...prev.criteria];
      const existing = next[index];
      if (!existing) return prev;
      next[index] = { ...existing, ...updates };
      return { ...prev, criteria: next };
    });
    setIsDirty(true);
  };

  const addCriterion = () => {
    const newCriterion: RubricEditorCriterion = {
      id: `new-${Date.now()}`,
      name: t("widget.rubricEditor.newCriterion"),
      description: "",
      maxScore: 5,
      commentRequired: false,
      position: edited.criteria.length,
    };
    updateRubric({ criteria: [...edited.criteria, newCriterion] });
  };

  const removeCriterion = (index: number) => {
    if (edited.criteria.length === 1) {
      alert(t("widget.rubricEditor.cannotDeleteLast"));
      return;
    }
    if (!confirm(t("widget.rubricEditor.deleteCriterionConfirm"))) return;
    updateRubric({ criteria: edited.criteria.filter((_, i) => i !== index) });
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setEdited((prev) => {
      const next = [...prev.criteria];
      const dragged = next[draggedIndex];
      if (!dragged) return prev;
      next.splice(draggedIndex, 1);
      next.splice(index, 0, dragged);
      return { ...prev, criteria: next };
    });
    setDraggedIndex(index);
    setIsDirty(true);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  return {
    edited,
    isDirty,
    draggedIndex,
    handleSave,
    updateRubric,
    updateCriterion,
    addCriterion,
    removeCriterion,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
