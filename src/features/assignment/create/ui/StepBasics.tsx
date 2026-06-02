import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { Label, Select, TextField, Textarea } from "@/shared/ui";

import { courseRepo } from "@/entities/course";
import { groupRepo } from "@/entities/group";

import type { AssignmentFormData } from "../model/types";

interface StepBasicsProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
  lockCourse?: boolean;
  lockGroup?: boolean;
}

export function StepBasics({ data, onUpdate, lockCourse, lockGroup }: StepBasicsProps) {
  const { t } = useTranslation();
  const { data: courses } = useAsync(() => courseRepo.getAll(), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.basics.title")}
        </h2>
      </div>

      <div>
        <Label>{t("feature.assignmentCreate.basics.courseLabel")}</Label>
        <Select
          aria-label={t("feature.assignmentCreate.basics.courseLabel")}
          value={data.courseId}
          onChange={(e) => onUpdate({ courseId: e.target.value, groupId: null })}
          disabled={lockCourse}
        >
          <option value="">{t("feature.assignmentCreate.basics.coursePlaceholder")}</option>
          {(courses ?? []).map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </Select>
        {lockCourse && (
          <p className="text-xs text-muted-foreground mt-1">
            {t("feature.assignmentCreate.basics.courseLockedHint")}
          </p>
        )}
      </div>

      <GroupField
        courseId={data.courseId}
        value={data.groupId}
        onChange={(groupId) => onUpdate({ groupId })}
        disabled={lockGroup}
      />

      <div>
        <Label>{t("feature.assignmentCreate.basics.titleLabel")}</Label>
        <TextField
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder={t("feature.assignmentCreate.basics.titlePlaceholder")}
        />
      </div>

      <div>
        <Label>{t("feature.assignmentCreate.basics.descriptionLabel")}</Label>
        <Textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={6}
          placeholder={t("feature.assignmentCreate.basics.descriptionPlaceholder")}
        />
        <p className="text-13 text-muted-foreground mt-1">
          {t("feature.assignmentCreate.basics.characters", { count: data.description.length })}
        </p>
      </div>
    </div>
  );
}

interface GroupFieldProps {
  courseId: string;
  value: string | null;
  onChange: (groupId: string | null) => void;
  disabled?: boolean;
}

function GroupField({ courseId, value, onChange, disabled }: GroupFieldProps) {
  const { t } = useTranslation();
  const { data: groups, isLoading } = useAsync(
    () => (courseId ? groupRepo.listForCourse(courseId) : Promise.resolve([])),
    [courseId],
  );

  const selectDisabled = disabled || !courseId || isLoading;

  return (
    <div>
      <Label>{t("feature.assignmentCreate.basics.audienceLabel")}</Label>
      <Select
        aria-label={t("feature.assignmentCreate.basics.audienceLabel")}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={selectDisabled}
      >
        <option value="">{t("feature.assignmentCreate.basics.audienceWholeCourse")}</option>
        {(groups ?? []).map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        {value
          ? t("feature.assignmentCreate.basics.audienceGroupHint")
          : t("feature.assignmentCreate.basics.audienceCourseHint")}
      </p>
    </div>
  );
}
