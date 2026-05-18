import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";

import { courseRepo } from "@/entities/course";

import type { AssignmentFormData } from "../model/types";

interface StepBasicsProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
  lockCourse?: boolean;
}

export function StepBasics({ data, onUpdate, lockCourse }: StepBasicsProps) {
  const { t } = useTranslation();
  const { data: courses } = useAsync(() => courseRepo.getAll(), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.basics.title")}
        </h2>
        <p className="text-[15px] text-muted-foreground">
          {t("feature.assignmentCreate.basics.subtitle")}
        </p>
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-2">
          {t("feature.assignmentCreate.basics.courseLabel")}{" "}
          <span className="text-destructive">*</span>
        </label>
        <select
          value={data.courseId}
          onChange={(e) => onUpdate({ courseId: e.target.value })}
          disabled={lockCourse}
          className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors bg-card disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <option value="">{t("feature.assignmentCreate.basics.coursePlaceholder")}</option>
          {(courses ?? []).map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        {lockCourse && (
          <p className="text-[12px] text-muted-foreground mt-1">
            {t("feature.assignmentCreate.basics.courseLockedHint")}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-2">
          {t("feature.assignmentCreate.basics.titleLabel")}{" "}
          <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder={t("feature.assignmentCreate.basics.titlePlaceholder")}
          className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-2">
          {t("feature.assignmentCreate.basics.descriptionLabel")}
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={6}
          placeholder={t("feature.assignmentCreate.basics.descriptionPlaceholder")}
          className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors resize-none"
        />
        <p className="text-[13px] text-muted-foreground mt-1">
          {t("feature.assignmentCreate.basics.characters", { count: data.description.length })}
        </p>
      </div>

      <div className="bg-info-light border border-info rounded-[12px] p-4">
        <p className="text-[13px] text-foreground">
          <strong>{t("feature.assignmentCreate.basics.tip")}</strong>{" "}
          {t("feature.assignmentCreate.basics.tipText")}
        </p>
      </div>
    </div>
  );
}
