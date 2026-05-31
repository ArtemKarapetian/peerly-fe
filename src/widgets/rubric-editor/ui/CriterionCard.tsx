import { GripVertical, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { TextField, Textarea } from "@/shared/ui";

import type { RubricCriterionData } from "../model/types";

interface CriterionCardProps {
  criterion: RubricCriterionData;
  index: number;
  isDragging: boolean;
  onUpdate: (updates: Partial<RubricCriterionData>) => void;
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
          <CriterionFlagsRow criterion={criterion} onUpdate={onUpdate} />
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

function CriterionMaxScoreField({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">
        {t("widget.rubricEditor.maxPoints")}
      </label>
      <TextField
        type="number"
        min="1"
        max="10"
        value={value}
        onChange={(e) => {
          const raw = parseInt(e.target.value);
          const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 10) : 5;
          onChange(clamped);
        }}
        className="text-sm px-3 py-2 rounded-sm"
      />
    </div>
  );
}

interface CriterionFlagsRowProps {
  criterion: RubricCriterionData;
  onUpdate: (updates: Partial<RubricCriterionData>) => void;
}

function CriterionFlagsRow({ criterion, onUpdate }: CriterionFlagsRowProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <FlagCheckbox
        checked={criterion.required}
        label={t("widget.rubricEditor.required")}
        onChange={(v) => onUpdate({ required: v })}
      />
      <FlagCheckbox
        checked={criterion.commentRequired || false}
        label={t("widget.rubricEditor.commentRequired")}
        onChange={(v) => onUpdate({ commentRequired: v })}
      />
      {criterion.commentRequired && (
        <MinCharsField
          value={criterion.minCommentLength}
          onChange={(v) => onUpdate({ minCommentLength: v })}
        />
      )}
    </div>
  );
}

function FlagCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-2 border-border text-brand-primary focus:ring-brand-primary"
      />
      <span className="text-13 text-foreground">{label}</span>
    </label>
  );
}

function MinCharsField({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{t("widget.rubricEditor.minChars")}</span>
      <input
        type="number"
        min="0"
        value={value || ""}
        onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : undefined)}
        className="w-16 px-2 py-1 bg-background border-2 border-border rounded-2sm text-13 focus:outline-none focus:border-brand-primary"
        placeholder="20"
      />
    </div>
  );
}
