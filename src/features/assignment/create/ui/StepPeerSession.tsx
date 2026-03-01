import { Users, Shuffle, EyeOff, RefreshCw } from "lucide-react";

import type { AssignmentFormData } from "../model/types";

/**
 * StepPeerSession - Шаг 4: Настройки peer review
 *
 * - Количество рецензий на работу (k)
 * - Режим распределения (случайный/по навыкам/вручную)
 * - Анонимность (полная/частичная/без анонимности)
 * - Переназначение рецензий
 */

interface StepPeerSessionProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

export function StepPeerSession({ data, onUpdate }: StepPeerSessionProps) {
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateChange = (value: string) => {
    onUpdate({
      reassignmentDeadline: value ? new Date(value) : null,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Настройки peer review
        </h2>
        <p className="text-[15px] text-[#767692]">Настройте параметры взаимного рецензирования</p>
      </div>

      {/* Reviews Per Submission */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-3">
          Количество рецензий на одну работу (k) <span className="text-[#d4183d]">*</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={data.reviewsPerSubmission}
            onChange={(e) => onUpdate({ reviewsPerSubmission: parseInt(e.target.value) })}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={data.reviewsPerSubmission}
              onChange={(e) => onUpdate({ reviewsPerSubmission: parseInt(e.target.value) || 1 })}
              className="w-16 px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[15px] font-medium text-center focus:outline-none focus:border-[#5b8def]"
            />
            <Users className="w-5 h-5 text-[#767692]" />
          </div>
        </div>
        <p className="text-[13px] text-[#767692] mt-2">
          Каждая работа получит {data.reviewsPerSubmission}{" "}
          {data.reviewsPerSubmission === 1
            ? "рецензию"
            : data.reviewsPerSubmission < 5
              ? "рецензии"
              : "рецензий"}
          . Рекомендуется: 3-5 для баланса качества и нагрузки.
        </p>
      </div>

      {/* Distribution Mode */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-3">
          Режим распределения рецензий
        </label>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onUpdate({ distributionMode: "random" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.distributionMode === "random"
                  ? "border-[#5b8def] bg-[#e9f5ff]"
                  : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
              }
            `}
          >
            <Shuffle className="w-5 h-5 text-[#767692] mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-[#21214f] mb-1">
                Случайное распределение
              </div>
              <div className="text-[13px] text-[#767692]">
                Работы распределяются случайным образом между студентами. Быстро и справедливо.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ distributionMode: "skill-based" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.distributionMode === "skill-based"
                  ? "border-[#5b8def] bg-[#e9f5ff]"
                  : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
              }
            `}
          >
            <Users className="w-5 h-5 text-[#767692] mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-[#21214f] mb-1">На основе навыков</div>
              <div className="text-[13px] text-[#767692]">
                Система подбирает рецензентов со схожим уровнем. Требует предварительных данных.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ distributionMode: "manual" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.distributionMode === "manual"
                  ? "border-[#5b8def] bg-[#e9f5ff]"
                  : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
              }
            `}
          >
            <RefreshCw className="w-5 h-5 text-[#767692] mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-[#21214f] mb-1">Вручную</div>
              <div className="text-[13px] text-[#767692]">
                Вы сами распределяете работы между студентами. Максимальный контроль.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Anonymity Mode */}
      <div>
        <label className="block text-[14px] font-medium text-[#21214f] mb-3">
          Уровень анонимности
        </label>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onUpdate({ anonymityMode: "full" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.anonymityMode === "full"
                  ? "border-[#5b8def] bg-[#e9f5ff]"
                  : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
              }
            `}
          >
            <EyeOff className="w-5 h-5 text-[#767692] mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-[#21214f] mb-1">Полная анонимность</div>
              <div className="text-[13px] text-[#767692]">
                Студенты не видят, кто автор работы и кто рецензент. Рекомендуется для
                объективности.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ anonymityMode: "partial" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.anonymityMode === "partial"
                  ? "border-[#5b8def] bg-[#e9f5ff]"
                  : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
              }
            `}
          >
            <Users className="w-5 h-5 text-[#767692] mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-[#21214f] mb-1">
                Частичная анонимность
              </div>
              <div className="text-[13px] text-[#767692]">
                Автор работы скрыт, но рецензент виден. Полезно для обучения рецензированию.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ anonymityMode: "none" })}
            className={`
              w-full p-4 border-2 rounded-[12px] text-left transition-all flex items-start gap-3
              ${
                data.anonymityMode === "none"
                  ? "border-[#5b8def] bg-[#e9f5ff]"
                  : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
              }
            `}
          >
            <Users className="w-5 h-5 text-[#767692] mt-0.5" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-[#21214f] mb-1">Без анонимности</div>
              <div className="text-[13px] text-[#767692]">
                Все видят друг друга. Подходит для работы в малых группах.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Reassignment */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={data.allowReassignment}
            onChange={(e) => onUpdate({ allowReassignment: e.target.checked })}
            className="w-5 h-5 rounded border-2 border-[#e6e8ee] text-[#5b8def] focus:ring-[#5b8def]"
          />
          <span className="text-[14px] font-medium text-[#21214f]">
            Разрешить переназначение рецензий
          </span>
        </label>

        {data.allowReassignment && (
          <div className="ml-7 space-y-3">
            <p className="text-[13px] text-[#767692]">
              Студенты смогут запросить другую работу для рецензирования, если текущая слишком
              сложная или есть конфликт интересов.
            </p>

            <div>
              <label className="block text-[13px] font-medium text-[#21214f] mb-2">
                Дедлайн для запроса переназначения
              </label>
              <input
                type="datetime-local"
                value={formatDateForInput(data.reassignmentDeadline)}
                onChange={(e) => handleDateChange(e.target.value)}
                max={formatDateForInput(data.reviewDeadline)}
                className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:outline-none focus:border-[#5b8def] transition-colors"
              />
              <p className="text-[12px] text-[#767692] mt-1">
                После этого времени переназначение будет недоступно
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-[#e9f5ff] border border-[#a0b8f1] rounded-[12px] p-4">
        <p className="text-[13px] text-[#21214f]">
          <strong>Совет:</strong> Для курсов с большим количеством студентов (30+) рекомендуется
          случайное распределение с полной анонимностью и k=3-5 рецензий.
        </p>
      </div>
    </div>
  );
}
