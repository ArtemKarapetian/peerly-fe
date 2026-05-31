import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { DemoAssignment } from "@/entities/assignment/model/types";

import { AssignmentStatusBadge } from "./AssignmentStatusBadge";

interface AssignmentRowProps {
  assignment: DemoAssignment;
  courseName: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function AssignmentRow({
  assignment,
  courseName,
  isSelected,
  onSelect,
}: AssignmentRowProps) {
  const { t } = useTranslation();
  const hasRubric = Boolean(assignment.rubricId);
  const stateClass = isSelected
    ? "border-brand-primary bg-brand-primary-light"
    : "border-border hover:border-brand-primary bg-card";

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 border-2 rounded-md transition-all ${stateClass}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-medium text-foreground">{assignment.title}</h3>
            {isSelected && <CheckCircle className="w-4 h-4 text-brand-primary" />}
          </div>

          <p className="text-13 text-muted-foreground mb-2">
            {courseName} • {assignment.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <AssignmentStatusBadge status={assignment.status} />
            <span className="text-xs text-muted-foreground">
              {t("feature.assignmentPicker.deadline")}:{" "}
              {assignment.dueDate.toLocaleDateString("ru-RU")}
            </span>
            {hasRubric && (
              <span className="px-2 py-1 bg-warning-light text-warning rounded-2sm text-2xs font-medium">
                {t("feature.assignmentPicker.hasRubric")}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
