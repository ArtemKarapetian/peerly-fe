import { GripVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TextField, Textarea } from "@/shared/ui";

import type { RubricEditorCriterion } from "../model/types";

interface CriterionCardProps {
  criterion: RubricEditorCriterion;
  index: number;
  isDragging: boolean;
  onUpdate: (updates: Partial<RubricEditorCriterion>) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export function CriterionCard({
  criterion,
  isDragging,
  onUpdate,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: CriterionCardProps) {
  const { t } = useTranslation();
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`bg-card border rounded-[14px] p-4 transition-colors border-border hover:border-brand-primary/60 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          title={t("widget.rubricEditor.dragToReorder")}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1 space-y-3">
          <CriterionNameField value={criterion.name} onChange={(v) => onUpdate({ name: v })} />
          <CriterionDescriptionField
            value={criterion.description}
            onChange={(v) => onUpdate({ description: v })}
          />
          <CriterionMaxScoreField
            value={criterion.maxScore}
            onChange={(v) => onUpdate({ maxScore: v })}
          />
          <CommentRequiredCheckbox
            checked={criterion.commentRequired}
            onChange={(v) => onUpdate({ commentRequired: v })}
          />
        </div>

        <button
          onClick={onRemove}
          className="p-2 hover:bg-error-light rounded-sm transition-colors"
          title={t("widget.rubricEditor.deleteCriterion")}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      </div>
    </div>
  );
}

function CriterionNameField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation();
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-medium px-3 py-2 rounded-sm"
      placeholder={t("widget.rubricEditor.criterionNamePlaceholder")}
    />
  );
}

function CriterionDescriptionField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
      className="text-sm px-3 py-2 rounded-sm"
      placeholder={t("widget.rubricEditor.criterionDescPlaceholder")}
    />
  );
}

const MIN_SCORE = 1;
const MAX_SCORE = 10;

function CriterionMaxScoreField({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!Number.isFinite(n)) {
      setDraft(String(value));
      return;
    }
    const clamped = Math.min(Math.max(n, MIN_SCORE), MAX_SCORE);
    setDraft(String(clamped));
    if (clamped !== value) onChange(clamped);
  };

  return (
    <div>
      <label className="block text-13 text-muted-foreground mb-1">
        {t("widget.rubricEditor.maxPoints")}
      </label>
      <TextField
        type="number"
        inputMode="numeric"
        min={MIN_SCORE}
        max={MAX_SCORE}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        className="text-sm px-3 py-2 rounded-sm w-24"
      />
      <p className="text-xs text-muted-foreground mt-1">
        {t("widget.rubricEditor.maxPointsHint", { min: MIN_SCORE, max: MAX_SCORE })}
      </p>
    </div>
  );
}

function CommentRequiredCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-2 border-border text-brand-primary focus:ring-brand-primary"
      />
      <span className="text-13 text-foreground">{t("widget.rubricEditor.commentRequired")}</span>
    </label>
  );
}
