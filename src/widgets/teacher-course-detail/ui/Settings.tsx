import { Save, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { Label, TextField, Textarea } from "@/shared/ui";

import { usePublishCourse, useUpdateCourse } from "@/entities/course";
import { Course } from "@/entities/course";

interface TeacherCourseSettingsProps {
  course: Course;
}

export function TeacherCourseSettings({ course }: TeacherCourseSettingsProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description ?? "");

  const mutation = useUpdateCourse(course.id);
  const publishMutation = usePublishCourse(course.id);

  const isDirty = name !== course.name || description !== (course.description ?? "");
  const isDraft = course.backendStatus === "draft";

  const handlePublish = () => {
    publishMutation.mutate(undefined, {
      onSuccess: () => toast.success(t("widget.settings.publishSuccess")),
      onError: (err) => toast.error(humanizeApiError(err, t("teacher.courseDetail.publishError"))),
    });
  };

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
        <Label>{t("widget.settings.courseName")}</Label>
        <TextField value={name} onChange={(e) => setName(e.target.value)} className="py-2" />
      </div>

      <div>
        <Label>{t("widget.settings.description")}</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="py-2"
        />
      </div>

      <div className="pt-2 flex items-center gap-3 flex-wrap">
        <button
          onClick={handleSave}
          disabled={!isDirty || !name.trim() || mutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-text-inverse rounded-md hover:bg-brand-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {mutation.isPending ? t("common.saving") : t("widget.settings.saveChanges")}
        </button>

        {isDraft ? (
          <button
            onClick={handlePublish}
            disabled={publishMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-success text-text-inverse rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {publishMutation.isPending ? t("common.saving") : t("teacher.courseDetail.publishBtn")}
          </button>
        ) : null}
      </div>

      {isDraft ? (
        <p className="text-13 text-muted-foreground">{t("teacher.courseDetail.publishHint")}</p>
      ) : null}
    </div>
  );
}
