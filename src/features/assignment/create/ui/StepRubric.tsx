import { ChevronRight, Layers, Plus, Search } from "lucide-react";
import { useState } from "react";

import type { AssignmentFormData } from "../model/types";

/**
 * StepRubric - Шаг 3: Рубрика оценивания
 *
 * - Выбор рубрики из библиотеки
 * - Создание новой рубрики
 * - Предпросмотр выбранной рубрики
 */

interface StepRubricProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

interface RubricItem {
  id: string;
  name: string;
  description: string;
  taskType: string;
  criteriaCount: number;
  tags: string[];
}

interface StoredRubric {
  id: string;
  name: string;
  description: string;
  taskType: string;
  criteria?: unknown[];
  tags?: string[];
}

const getMockRubrics = (): RubricItem[] => {
  const stored = localStorage.getItem("peerly_rubrics_library");
  if (stored) {
    try {
      const parsed: StoredRubric[] = JSON.parse(stored);
      return parsed.map(
        (r): RubricItem => ({
          id: r.id,
          name: r.name,
          description: r.description,
          taskType: r.taskType,
          criteriaCount: r.criteria?.length || 0,
          tags: r.tags || [],
        }),
      );
    } catch (e) {
      console.error("Failed to parse rubrics", e);
    }
  }

  return [
    {
      id: "r1",
      name: "Оценка веб-проекта",
      description:
        "Критерии оценки финального веб-проекта с фокусом на функциональность, дизайн и качество кода",
      taskType: "project",
      criteriaCount: 4,
      tags: ["веб-разработка", "frontend"],
    },
    {
      id: "r2",
      name: "Проверка кода (Code Review)",
      description: "Рубрика для оценки качества программного кода",
      taskType: "code",
      criteriaCount: 3,
      tags: ["программирование", "code-review"],
    },
    {
      id: "r3",
      name: "Эссе и письменные работы",
      description: "Критерии оценки текстовых работ и аналитических эссе",
      taskType: "text",
      criteriaCount: 4,
      tags: ["письменные работы", "эссе"],
    },
  ];
};

export function StepRubric({ data, onUpdate }: StepRubricProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const rubrics = getMockRubrics();

  const filteredRubrics = rubrics.filter((rubric) => {
    // Prefer matching task type
    return (
      rubric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rubric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rubric.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Sort by task type match first
  const sortedRubrics = [...filteredRubrics].sort((a, b) => {
    const aMatches = a.taskType === data.taskType;
    const bMatches = b.taskType === data.taskType;
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    return 0;
  });

  const handleSelectRubric = (rubricId: string, rubricName: string) => {
    onUpdate({ rubricId, rubricName });
  };

  const handleCreateNew = () => {
    // Open rubrics library in new tab/window or navigate
    window.open("#/teacher/rubrics", "_blank");
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

  const selectedRubric = rubrics.find((r) => r.id === data.rubricId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Рубрика оценивания
        </h2>
        <p className="text-[15px] text-[#767692]">
          Выберите рубрику для оценивания работ или создайте новую
        </p>
      </div>

      {/* Selected Rubric Display */}
      {selectedRubric && (
        <div className="bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[12px] p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-[#4caf50]" />
                <h3 className="text-[16px] font-medium text-[#21214f]">Выбранная рубрика</h3>
              </div>
              <p className="text-[15px] text-[#21214f] font-medium mb-1">{selectedRubric.name}</p>
              <p className="text-[13px] text-[#767692] mb-2">{selectedRubric.description}</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white text-[#21214f] rounded-[6px] text-[12px] font-medium">
                  {getTaskTypeLabel(selectedRubric.taskType)}
                </span>
                <span className="text-[13px] text-[#767692]">
                  {selectedRubric.criteriaCount} критериев
                </span>
              </div>
            </div>
            <button
              onClick={() => onUpdate({ rubricId: null, rubricName: undefined })}
              className="px-3 py-2 text-[13px] text-[#767692] hover:text-[#d4183d] transition-colors"
            >
              Отменить
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767692]" />
          <input
            type="text"
            placeholder="Поиск рубрики по названию, тегам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>
      </div>

      {/* Create New Button */}
      <button
        type="button"
        onClick={handleCreateNew}
        className="w-full flex items-center justify-between p-4 border-2 border-dashed border-[#a0b8f1] bg-[#e9f5ff] rounded-[12px] hover:border-[#5b8def] hover:bg-[#d2e1f8] transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5b8def] rounded-[8px] flex items-center justify-center group-hover:bg-[#4a7de8] transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-medium text-[#21214f]">Создать новую рубрику</p>
            <p className="text-[13px] text-[#767692]">
              Откроется в новой вкладке, затем вернитесь сюда
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#767692] group-hover:text-[#21214f]" />
      </button>

      {/* Rubrics List */}
      <div>
        <h3 className="text-[14px] font-medium text-[#21214f] mb-3">
          Библиотека рубрик
          {data.taskType && (
            <span className="ml-2 text-[13px] font-normal text-[#767692]">
              (рекомендованные для типа "{getTaskTypeLabel(data.taskType)}" в начале списка)
            </span>
          )}
        </h3>

        {sortedRubrics.length === 0 ? (
          <div className="text-center py-12 bg-[#f9f9f9] border border-[#e6e8ee] rounded-[12px]">
            <Layers className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
            <p className="text-[15px] text-[#767692]">
              Рубрики не найдены. Создайте новую рубрику.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {sortedRubrics.map((rubric) => {
              const isSelected = data.rubricId === rubric.id;
              const matchesTaskType = rubric.taskType === data.taskType;

              return (
                <button
                  key={rubric.id}
                  type="button"
                  onClick={() => handleSelectRubric(rubric.id, rubric.name)}
                  className={`
                    w-full text-left p-4 border-2 rounded-[12px] transition-all
                    ${
                      isSelected
                        ? "border-[#5b8def] bg-[#e9f5ff]"
                        : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-[15px] font-medium text-[#21214f]">
                      {rubric.name}
                      {matchesTaskType && (
                        <span className="ml-2 px-2 py-0.5 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
                          Рекомендовано
                        </span>
                      )}
                    </h4>
                  </div>

                  <p className="text-[13px] text-[#767692] mb-3 line-clamp-2">
                    {rubric.description}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-[#f9f9f9] text-[#21214f] rounded-[6px] text-[12px] font-medium">
                      {getTaskTypeLabel(rubric.taskType)}
                    </span>
                    <span className="text-[12px] text-[#767692]">
                      {rubric.criteriaCount} критериев
                    </span>
                    {rubric.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[#e9f5ff] text-[#5b8def] rounded-[6px] text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-[#e9f5ff] border border-[#a0b8f1] rounded-[12px] p-4">
        <p className="text-[13px] text-[#21214f]">
          <strong>Можно пропустить:</strong> Рубрику можно не выбирать сейчас и добавить позже.
          Однако наличие рубрики помогает студентам понять критерии оценивания.
        </p>
      </div>
    </div>
  );
}
