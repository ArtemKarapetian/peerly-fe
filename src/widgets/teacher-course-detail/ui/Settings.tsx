import { Save } from "lucide-react";

import { DemoCourse } from "@/entities/course/model/types.ts";

interface TeacherCourseSettingsProps {
  course: DemoCourse;
}

export function TeacherCourseSettings({ course }: TeacherCourseSettingsProps) {
  const handleSave = () => {
    alert("Настройки сохранены");
  };

  return (
    <div className="max-w-[600px]">
      <p className="text-[15px] text-[#767692] mb-6">Основные настройки курса</p>

      <div className="space-y-6">
        <div>
          <label className="block text-[13px] font-medium text-[#21214f] mb-2">
            Название курса
          </label>
          <input
            type="text"
            defaultValue={course.name}
            className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#21214f] mb-2">Код курса</label>
          <input
            type="text"
            defaultValue={course.code}
            className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#21214f] mb-2">Описание</label>
          <textarea
            defaultValue="Курс по веб-разработке с фокусом на современные фреймворки и best practices"
            rows={4}
            className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] resize-none focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#21214f] mb-2">Статус курса</label>
          <select
            defaultValue={course.status}
            className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] bg-white focus:outline-none focus:border-[#5b8def] transition-colors"
          >
            <option value="active">Активен</option>
            <option value="archived">Архивирован</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Сохранить изменения
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-[#e6e8ee]">
        <h3 className="text-[16px] font-medium text-[#d4183d] mb-2">Опасная зона</h3>
        <p className="text-[14px] text-[#767692] mb-4">
          Удаление курса необратимо и удалит все связанные задания, работы и рецензии.
        </p>
        <button className="px-4 py-2 bg-[#fff5f5] text-[#d4183d] border-2 border-[#d4183d] rounded-[12px] hover:bg-[#d4183d] hover:text-white transition-colors">
          Удалить курс
        </button>
      </div>
    </div>
  );
}
