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
      <p className="text-[15px] text-[#767692] mb-6">{t("widget.settings.subtitle")}</p>

      <div className="space-y-6">
        <div>
          <label className="block text-[13px] font-medium text-[#21214f] mb-2">
            {t("widget.settings.courseName")}
          </label>
          <input
            type="text"
            defaultValue={course.name}
            className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#21214f] mb-2">
            {t("widget.settings.courseCode")}
          </label>
          <input
            type="text"
            defaultValue={course.code}
            className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#21214f] mb-2">
            {t("widget.settings.description")}
          </label>
          <textarea
            defaultValue={t("widget.settings.descriptionDefault")}
            rows={4}
            className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] resize-none focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#21214f] mb-2">
            {t("widget.settings.courseStatus")}
          </label>
          <select
            defaultValue={course.status}
            className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] bg-white focus:outline-none focus:border-[#5b8def] transition-colors"
          >
            <option value="active">{t("widget.settings.statusActive")}</option>
            <option value="archived">{t("widget.settings.statusArchived")}</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {t("widget.settings.saveChanges")}
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-[#e6e8ee]">
        <h3 className="text-[16px] font-medium text-[#d4183d] mb-2">
          {t("widget.settings.dangerZone")}
        </h3>
        <p className="text-[14px] text-[#767692] mb-4">{t("widget.settings.dangerDescription")}</p>
        <button className="px-4 py-2 bg-[#fff5f5] text-[#d4183d] border-2 border-[#d4183d] rounded-[12px] hover:bg-[#d4183d] hover:text-white transition-colors">
          {t("widget.settings.deleteCourse")}
        </button>
      </div>
    </div>
  );
}
