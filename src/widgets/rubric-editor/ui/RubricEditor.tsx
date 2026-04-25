import { Plus, GripVertical, Trash2, Save, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import type { RubricData, RubricCriterionData } from "../model/types";

interface RubricEditorProps {
  rubric: RubricData;
  onSave: (rubric: RubricData) => void;
}

export function RubricEditor({ rubric, onSave }: RubricEditorProps) {
  const { t } = useTranslation();
  const [editedRubric, setEditedRubric] = useState<RubricData>(rubric);
  const [isDirty, setIsDirty] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // сбрасываем форму при смене рубрики; setTimeout чтобы не каскадить рендер
  useEffect(() => {
    const t = setTimeout(() => {
      setEditedRubric(rubric);
      setIsDirty(false);
    }, 0);
    return () => clearTimeout(t);
  }, [rubric]);

  const handleSave = () => {
    onSave(editedRubric);
    setIsDirty(false);
  };

  const updateRubric = (updates: Partial<RubricData>) => {
    setEditedRubric({ ...editedRubric, ...updates });
    setIsDirty(true);
  };

  const updateCriterion = (index: number, updates: Partial<RubricCriterionData>) => {
    const newCriteria = [...editedRubric.criteria];
    newCriteria[index] = { ...newCriteria[index], ...updates };
    updateRubric({ criteria: newCriteria });
  };

  const addCriterion = () => {
    const newCriterion: RubricCriterionData = {
      id: `c${Date.now()}`,
      name: t("widget.rubricEditor.newCriterion"),
      description: "",
      maxScore: 5,
      required: true,
    };
    updateRubric({ criteria: [...editedRubric.criteria, newCriterion] });
  };

  const removeCriterion = (index: number) => {
    if (editedRubric.criteria.length === 1) {
      alert(t("widget.rubricEditor.cannotDeleteLast"));
      return;
    }
    if (confirm(t("widget.rubricEditor.deleteCriterionConfirm"))) {
      const newCriteria = editedRubric.criteria.filter((_, i) => i !== index);
      updateRubric({ criteria: newCriteria });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCriteria = [...editedRubric.criteria];
    const draggedItem = newCriteria[draggedIndex];
    newCriteria.splice(draggedIndex, 1);
    newCriteria.splice(index, 0, draggedItem);

    setEditedRubric({ ...editedRubric, criteria: newCriteria });
    setDraggedIndex(index);
    setIsDirty(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div>
      {isDirty && (
        <div className="mb-4 flex items-center justify-between bg-warning-light border border-warning rounded-[12px] p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <span className="text-[14px] text-warning font-medium">
              {t("widget.rubricEditor.unsavedChanges")}
            </span>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-inverse rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
          >
            <Save className="w-4 h-4" />
            {t("common.save")}
          </button>
        </div>
      )}

      <section className="mb-8 space-y-4">
        <h3 className="text-[18px] font-medium text-foreground tracking-[-0.5px]">
          {t("widget.rubricEditor.basicInfo")}
        </h3>

        <div>
          <label className="block text-[13px] font-medium text-foreground mb-2">
            {t("widget.rubricEditor.rubricName")}
          </label>
          <input
            type="text"
            value={editedRubric.name}
            onChange={(e) => updateRubric({ name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-foreground mb-2">
            {t("widget.rubricEditor.description")}
          </label>
          <textarea
            value={editedRubric.description}
            onChange={(e) => updateRubric({ description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] outline-none focus:border-brand-primary transition-colors resize-none"
          />
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-medium text-foreground tracking-[-0.5px]">
            {t("widget.rubricEditor.gradingCriteria")}
          </h3>
          <button
            onClick={addCriterion}
            className="flex items-center gap-2 px-3 py-2 bg-brand-primary text-text-inverse rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
          >
            <Plus className="w-4 h-4" />
            {t("widget.rubricEditor.addCriterion")}
          </button>
        </div>

        <div className="space-y-4">
          {editedRubric.criteria.map((criterion, index) => (
            <div
              key={criterion.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                bg-card border rounded-[14px] p-4 transition-colors
                ${draggedIndex === index ? "opacity-50" : "opacity-100"}
                border-border hover:border-brand-primary/60
              `}
            >
              <div className="flex items-start gap-3 mb-4">
                <button
                  className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                  title={t("widget.rubricEditor.dragToReorder")}
                >
                  <GripVertical className="w-5 h-5" />
                </button>

                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) => updateCriterion(index, { name: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-border rounded-[8px] text-[15px] font-medium focus:outline-none focus:border-brand-primary transition-colors"
                    placeholder={t("widget.rubricEditor.criterionNamePlaceholder")}
                  />

                  <textarea
                    value={criterion.description}
                    onChange={(e) => updateCriterion(index, { description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-border rounded-[8px] text-[14px] focus:outline-none focus:border-brand-primary transition-colors resize-none"
                    placeholder={t("widget.rubricEditor.criterionDescPlaceholder")}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] text-muted-foreground mb-1">
                        {t("widget.rubricEditor.maxPoints")}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={criterion.maxScore}
                        onChange={(e) =>
                          updateCriterion(index, { maxScore: parseInt(e.target.value) || 5 })
                        }
                        className="w-full px-3 py-2 border-2 border-border rounded-[8px] text-[14px] focus:outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] text-muted-foreground mb-1">
                        {t("widget.rubricEditor.weight")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={criterion.weight || ""}
                        onChange={(e) =>
                          updateCriterion(index, {
                            weight: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-border rounded-[8px] text-[14px] focus:outline-none focus:border-brand-primary transition-colors"
                        placeholder={t("widget.rubricEditor.optional")}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criterion.required}
                        onChange={(e) => updateCriterion(index, { required: e.target.checked })}
                        className="w-4 h-4 rounded border-2 border-border text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-[13px] text-foreground">
                        {t("widget.rubricEditor.required")}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criterion.commentRequired || false}
                        onChange={(e) =>
                          updateCriterion(index, { commentRequired: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-2 border-border text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-[13px] text-foreground">
                        {t("widget.rubricEditor.commentRequired")}
                      </span>
                    </label>

                    {criterion.commentRequired && (
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-muted-foreground">
                          {t("widget.rubricEditor.minChars")}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={criterion.minCommentLength || ""}
                          onChange={(e) =>
                            updateCriterion(index, {
                              minCommentLength: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-16 px-2 py-1 border-2 border-border rounded-[6px] text-[13px] focus:outline-none focus:border-brand-primary"
                          placeholder="20"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeCriterion(index)}
                  className="p-2 hover:bg-error-light rounded-[8px] transition-colors"
                  title={t("widget.rubricEditor.deleteCriterion")}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-text-inverse rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {t("widget.rubricEditor.saveChanges")}
        </button>
      </div>
    </div>
  );
}
