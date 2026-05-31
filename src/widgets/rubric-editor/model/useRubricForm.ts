import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { RubricCriterionData, RubricData } from "./types";

export function useRubricForm(initial: RubricData, onSave: (r: RubricData) => void) {
  const { t } = useTranslation();
  const [edited, setEdited] = useState<RubricData>(initial);
  const [isDirty, setIsDirty] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEdited(initial);
      setIsDirty(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [initial]);

  const handleSave = () => {
    onSave(edited);
    setIsDirty(false);
  };

  const updateRubric = (updates: Partial<RubricData>) => {
    setEdited((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const updateCriterion = (index: number, updates: Partial<RubricCriterionData>) => {
    setEdited((prev) => {
      const next = [...prev.criteria];
      next[index] = { ...next[index], ...updates };
      return { ...prev, criteria: next };
    });
    setIsDirty(true);
  };

  const addCriterion = () => {
    const newCriterion: RubricCriterionData = {
      id: `c${Date.now()}`,
      name: t("widget.rubricEditor.newCriterion"),
      description: "",
      maxScore: 5,
      required: true,
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
