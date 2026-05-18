import { Save } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";

import { useUpdateCourse } from "@/entities/course";
import { DemoCourse } from "@/entities/course/model/types.ts";

interface TeacherCourseSettingsProps {
  course: DemoCourse;
}

export function TeacherCourseSettings({ course }: TeacherCourseSettingsProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description ?? "");

  const mutation = useUpdateCourse(course.id);

  const isDirty = name !== course.name || description !== (course.description ?? "");

  const handleSave = () => {
    if (!isDirty || !name.trim()) return;
    mutation.mutate(
      { name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => toast.success(t("widget.settings.settingsSaved")),
        onError: (err) => toast.error(humanizeApiError(err, t("common.error"))),
      },
    );
  };

  return (
    <div className="max-w-[600px] space-y-6">
      <div>
        <label className="block text-[13px] font-medium text-foreground mb-2">
          {t("widget.settings.courseName")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-foreground mb-2">
          {t("widget.settings.description")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] resize-none focus:outline-none focus:border-brand-primary transition-colors"
        />
      </div>

      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={!isDirty || !name.trim() || mutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-text-inverse rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {mutation.isPending ? t("common.saving") : t("widget.settings.saveChanges")}
        </button>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-border">
        <h3 className="text-[16px] font-medium text-destructive mb-2">
          {t("widget.settings.dangerZone")}
        </h3>
        <p className="text-[14px] text-muted-foreground mb-4">
          {t("widget.settings.dangerDescription")}
        </p>
        <button className="px-4 py-2 bg-error-light text-destructive border-2 border-destructive rounded-[12px] hover:bg-destructive hover:text-text-inverse transition-colors">
          {t("widget.settings.deleteCourse")}
        </button>
      </div>
    </div>
  );
}
