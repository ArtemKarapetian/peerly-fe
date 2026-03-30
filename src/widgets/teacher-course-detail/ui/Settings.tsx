import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DemoCourse } from "@/entities/course/model/types.ts";

interface TeacherCourseSettingsProps {
  course: DemoCourse;
}

export function TeacherCourseSettings({ course }: TeacherCourseSettingsProps) {
  const { t } = useTranslation();

  const handleSave = () => {
    alert(t("widget.settings.settingsSaved"));
  };

  return (
    <div className="max-w-[600px]">
      <p className="text-[15px] text-muted-foreground mb-6">{t("widget.settings.subtitle")}</p>

      <div className="space-y-6">
        <div>
          <label className="block text-[13px] font-medium text-foreground mb-2">
            {t("widget.settings.courseName")}
          </label>
          <input
            type="text"
            defaultValue={course.name}
            className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-foreground mb-2">
            {t("widget.settings.courseCode")}
          </label>
          <input
            type="text"
            defaultValue={course.code}
            className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-foreground mb-2">
            {t("widget.settings.description")}
          </label>
          <textarea
            defaultValue={t("widget.settings.descriptionDefault")}
            rows={4}
            className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] resize-none focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-foreground mb-2">
            {t("widget.settings.courseStatus")}
          </label>
          <select
            defaultValue={course.status}
            className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] bg-card focus:outline-none focus:border-brand-primary transition-colors"
          >
            <option value="active">{t("widget.settings.statusActive")}</option>
            <option value="archived">{t("widget.settings.statusArchived")}</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-text-inverse rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {t("widget.settings.saveChanges")}
          </button>
        </div>
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
