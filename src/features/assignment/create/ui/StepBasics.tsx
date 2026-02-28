import { Upload, X, FileText } from "lucide-react";
import { courseRepo } from "@/entities/course";
import type { AssignmentFormData } from "../model/types";

/**
 * StepBasics - Шаг 1: Основная информация
 *
 * - Выбор курса
 * - Название задания
 * - Описание
 * - Тип задания
 * - Прикрепленные файлы/ресурсы
 */

interface StepBasicsProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

export function StepBasics({ data, onUpdate }: StepBasicsProps) {
  const courses = courseRepo.getAll();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments = Array.from(files).map((file) => ({
      id: `f${Date.now()}_${Math.random()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));

    onUpdate({
      attachments: [...data.attachments, ...newAttachments],
    });
  };

  const removeAttachment = (id: string) => {
    onUpdate({
      attachments: data.attachments.filter((a) => a.id !== id),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Основная информация
        </h2>
        <p className="text-[15px] text-[#767692]">Укажите базовые параметры задания</p>
      </div>

      {/* Course Selection */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-2">
          Курс <span className="text-[#d4183d]">*</span>
        </label>
        <select
          value={data.courseId}
          onChange={(e) => onUpdate({ courseId: e.target.value })}
          className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors bg-white"
        >
          <option value="">Выберите курс...</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-2">
          Название задания <span className="text-[#d4183d]">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Создание лендинг-страницы"
          className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-2">
          Описание задания
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={6}
          placeholder="Опишите задание, требования, критерии..."
          className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors resize-none"
        />
        <p className="text-[13px] text-[#767692] mt-1">{data.description.length} символов</p>
      </div>

      {/* Task Type */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-3">
          Тип задания <span className="text-[#d4183d]">*</span>
        </label>
        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
          {[
            { value: "text", label: "Текст", desc: "Эссе, отчеты" },
            { value: "code", label: "Код", desc: "Программы" },
            { value: "project", label: "Проект", desc: "Комплексные работы" },
            { value: "files", label: "Файлы", desc: "Документы, медиа" },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() =>
                onUpdate({ taskType: type.value as "text" | "code" | "project" | "files" })
              }
              className={`
                p-4 border-2 rounded-[12px] text-left transition-all
                ${
                  data.taskType === type.value
                    ? "border-[#5b8def] bg-[#e9f5ff]"
                    : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
                }
              `}
            >
              <div className="text-[15px] font-medium text-[#21214f] mb-1">{type.label}</div>
              <div className="text-[12px] text-[#767692]">{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-2">
          Прикрепленные файлы и ресурсы
        </label>
        <p className="text-[13px] text-[#767692] mb-3">
          Инструкции, шаблоны, материалы для выполнения задания
        </p>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 px-4 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          <span className="text-[14px] font-medium">Загрузить файлы</span>
          <input type="file" multiple onChange={handleFileUpload} className="hidden" />
        </label>

        {/* Attachments List */}
        {data.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-[#f9f9f9] border border-[#e6e8ee] rounded-[8px]"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#767692]" />
                  <div>
                    <p className="text-[14px] text-[#21214f]">{file.name}</p>
                    <p className="text-[12px] text-[#767692]">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeAttachment(file.id)}
                  className="p-1 hover:bg-white rounded-[6px] transition-colors"
                >
                  <X className="w-4 h-4 text-[#767692]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-[#e9f5ff] border border-[#a0b8f1] rounded-[12px] p-4">
        <p className="text-[13px] text-[#21214f]">
          <strong>Совет:</strong> Чем подробнее описание и четче требования, тем качественнее будут
          рецензии студентов.
        </p>
      </div>
    </div>
  );
}
