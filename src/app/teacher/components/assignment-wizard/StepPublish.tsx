import { Check, Calendar, Users, Layers, Shield, Save, Send } from "lucide-react";
import { demoDataStore } from "@/app/stores/demoDataStore";
import type { AssignmentFormData } from "../../TeacherCreateAssignmentPage";

/**
 * StepPublish - Шаг 6: Публикация
 *
 * - Итоговая сводка всех настроек
 * - Кнопки "Опубликовать" и "Сохранить черновик"
 */

interface StepPublishProps {
  data: AssignmentFormData;
  onPublish: (asDraft: boolean) => void;
}

export function StepPublish({ data, onPublish }: StepPublishProps) {
  const courses = demoDataStore.getCourses();
  const course = courses.find((c) => c.id === data.courseId);

  const formatDate = (date: Date | null) => {
    if (!date) return "Не указано";
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "text":
        return "Текст";
      case "code":
        return "Код";
      case "project":
        return "Проект";
      case "files":
        return "Файлы";
      default:
        return type;
    }
  };

  const getDistributionLabel = (mode: string) => {
    switch (mode) {
      case "random":
        return "Случайное";
      case "skill-based":
        return "На основе навыков";
      case "manual":
        return "Вручную";
      default:
        return mode;
    }
  };

  const getAnonymityLabel = (mode: string) => {
    switch (mode) {
      case "full":
        return "Полная";
      case "partial":
        return "Частичная";
      case "none":
        return "Без анонимности";
      default:
        return mode;
    }
  };

  const enabledPlugins = [
    data.enablePlagiarismCheck && `Плагиат (порог ${data.plagiarismThreshold}%)`,
    data.enableLinter && "Линтинг кода",
    data.enableFormatCheck && "Проверка форматов",
    data.enableAnonymization && "Анонимизация",
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Готово к публикации
        </h2>
        <p className="text-[15px] text-[#767692]">
          Проверьте настройки и опубликуйте задание или сохраните как черновик
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#e9f5ff] rounded-[8px] flex items-center justify-center">
              <Check className="w-5 h-5 text-[#5b8def]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">Основная информация</h3>
            </div>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-[#e6e8ee] space-y-3">
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Курс</p>
              <p className="text-[14px] text-[#21214f] font-medium">
                {course?.name || "Не выбран"}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Название</p>
              <p className="text-[14px] text-[#21214f] font-medium">{data.title || "Не указано"}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Тип задания</p>
              <p className="text-[14px] text-[#21214f]">{getTaskTypeLabel(data.taskType)}</p>
            </div>
            {data.description && (
              <div>
                <p className="text-[12px] text-[#767692] mb-1">Описание</p>
                <p className="text-[13px] text-[#21214f] line-clamp-3">{data.description}</p>
              </div>
            )}
            {data.attachments.length > 0 && (
              <div>
                <p className="text-[12px] text-[#767692] mb-1">Прикрепленные файлы</p>
                <p className="text-[13px] text-[#21214f]">
                  {data.attachments.length} {data.attachments.length === 1 ? "файл" : "файлов"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Deadlines */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#e9f5ff] rounded-[8px] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#5b8def]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">Дедлайны</h3>
            </div>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-[#e6e8ee] space-y-3">
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Дедлайн сдачи работы</p>
              <p className="text-[14px] text-[#21214f]">{formatDate(data.submissionDeadline)}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Дедлайн рецензирования</p>
              <p className="text-[14px] text-[#21214f]">{formatDate(data.reviewDeadline)}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Политика опозданий</p>
              <p className="text-[14px] text-[#21214f]">
                {data.latePolicy === "soft"
                  ? `Мягкая (${data.latePenalty}% штрафа в день)`
                  : "Жесткая (работы не принимаются)"}
              </p>
            </div>
          </div>
        </div>

        {/* Rubric */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#e9f5ff] rounded-[8px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#5b8def]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">Рубрика оценивания</h3>
            </div>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-[#e6e8ee]">
            <p className="text-[14px] text-[#21214f]">{data.rubricName || "Не выбрана"}</p>
          </div>
        </div>

        {/* Peer Review Settings */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#e9f5ff] rounded-[8px] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#5b8def]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">Peer Review</h3>
            </div>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-[#e6e8ee] space-y-3">
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Рецензий на работу</p>
              <p className="text-[14px] text-[#21214f]">{data.reviewsPerSubmission}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Распределение</p>
              <p className="text-[14px] text-[#21214f]">
                {getDistributionLabel(data.distributionMode)}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Анонимность</p>
              <p className="text-[14px] text-[#21214f]">{getAnonymityLabel(data.anonymityMode)}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#767692] mb-1">Переназначение</p>
              <p className="text-[14px] text-[#21214f]">
                {data.allowReassignment ? "Разрешено" : "Запрещено"}
              </p>
            </div>
          </div>
        </div>

        {/* Plugins */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#e9f5ff] rounded-[8px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#5b8def]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">Плагины и проверки</h3>
            </div>
          </div>

          <div className="ml-13 pl-5 border-l-2 border-[#e6e8ee]">
            {enabledPlugins.length === 0 ? (
              <p className="text-[14px] text-[#767692]">Автоматические проверки отключены</p>
            ) : (
              <ul className="space-y-2">
                {enabledPlugins.map((plugin, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4caf50]" />
                    <span className="text-[14px] text-[#21214f]">{plugin}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-[#fff8e1] border border-[#ffe082] rounded-[12px] p-4">
        <p className="text-[13px] text-[#21214f]">
          <strong>Обратите внимание:</strong> После публикации задание станет видимым для студентов.
          Вы сможете редактировать настройки, но некоторые изменения (например, дедлайны) могут
          повлиять на уже начатые работы.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={() => onPublish(true)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors font-medium"
        >
          <Save className="w-5 h-5" />
          Сохранить черновик
        </button>
        <button
          onClick={() => onPublish(false)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors font-medium text-[16px]"
        >
          <Send className="w-5 h-5" />
          Опубликовать задание
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-[13px] text-[#767692]">
          Черновики сохраняются автоматически и доступны только вам.
          <br />
          Опубликованные задания сразу становятся видимы студентам курса.
        </p>
      </div>
    </div>
  );
}
