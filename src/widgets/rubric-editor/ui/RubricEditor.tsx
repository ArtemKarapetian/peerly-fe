import { ArrowLeft, Plus, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, SectionHeader } from "@/shared/ui";

import type { RubricEditorData } from "../model/types";
import { useRubricForm } from "../model/useRubricForm";

import { CriterionCard } from "./CriterionCard";
import { RubricBasicsSection } from "./RubricBasicsSection";
import { UnsavedChangesBanner } from "./UnsavedChangesBanner";

interface RubricEditorProps {
  rubric: RubricEditorData;
  onSave: (rubric: RubricEditorData) => void;
  onCancel?: () => void;
}

export function RubricEditor({ rubric, onSave, onCancel }: RubricEditorProps) {
  const { t } = useTranslation();
  const {
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
  } = useRubricForm(rubric, onSave);

  return (
    <Card>
      {isDirty && <UnsavedChangesBanner onSave={handleSave} />}

      <RubricBasicsSection name={edited.name} onUpdate={updateRubric} />

      <section className="mb-6">
        <SectionHeader as="h3" className="tracking-[-0.5px]">
          {t("widget.rubricEditor.gradingCriteria")}
        </SectionHeader>

        <div className="space-y-4">
          {edited.criteria.map((criterion, index) => (
            <CriterionCard
              key={criterion.id}
              criterion={criterion}
              index={index}
              isDragging={draggedIndex === index}
              onUpdate={(u) => updateCriterion(index, u)}
              onRemove={() => removeCriterion(index)}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            />
          ))}

          <button
            onClick={addCriterion}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 border-2 border-dashed border-border rounded-[14px] text-sm font-medium text-muted-foreground hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary-light/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("widget.rubricEditor.addCriterion")}
          </button>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-3 border-2 border-border text-foreground rounded-md hover:border-brand-primary hover:text-brand-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("widget.rubricEditor.backToLibrary")}
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-text-inverse rounded-md hover:bg-brand-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {t("widget.rubricEditor.saveChanges")}
        </button>
      </div>
    </Card>
  );
}
