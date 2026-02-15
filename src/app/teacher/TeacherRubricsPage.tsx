import { useState, useEffect } from "react";
import { AppShell } from "@/app/components/AppShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { ROUTES } from "@/shared/config/routes.ts";
import { Search, Plus, Filter, Copy, Eye, Edit } from "lucide-react";
import { RubricEditor } from "./components/RubricEditor";
import { RubricPreview } from "./components/RubricPreview";
import { AssignmentPickerModal } from "./components/AssignmentPickerModal";

/**
 * TeacherRubricsPage - Библиотека рубрик
 *
 * Двухколоночный layout:
 * - Слева: список рубрик с поиском и фильтрами
 * - Справа: редактор/просмотр рубрики
 */

export interface RubricCriterionData {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight?: number;
  required: boolean;
  commentRequired?: boolean;
  minCommentLength?: number;
}

export interface RubricData {
  id: string;
  name: string;
  description: string;
  taskType: "text" | "code" | "project";
  criteria: RubricCriterionData[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  teacherId: string;
}

type ViewMode = "edit" | "preview";

// Local storage key
const RUBRICS_STORAGE_KEY = "peerly_rubrics_library";

// Demo rubrics
const getInitialRubrics = (): RubricData[] => {
  // Try to load from localStorage
  const stored = localStorage.getItem(RUBRICS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map(
        (r: {
          id: string;
          name: string;
          description: string;
          taskType: string;
          criteria: RubricCriterionData[];
          tags: string[];
          createdAt: string;
          updatedAt: string;
        }) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
        }),
      );
    } catch (e) {
      console.error("Failed to parse stored rubrics", e);
    }
  }

  // Default demo rubrics
  return [
    {
      id: "r1",
      name: "Оценка веб-проекта",
      description:
        "Критерии оценки финального веб-проекта с фокусом на функциональность, дизайн и качество кода",
      taskType: "project" as const,
      tags: ["веб-разработка", "frontend", "fullstack"],
      teacherId: "u2",
      createdAt: new Date("2025-01-10"),
      updatedAt: new Date("2025-01-15"),
      criteria: [
        {
          id: "c1",
          name: "Функциональность",
          description:
            "Работоспособность всех требуемых функций и корректная обработка пользовательских сценариев",
          maxScore: 5,
          weight: 30,
          required: true,
          commentRequired: true,
          minCommentLength: 20,
        },
        {
          id: "c2",
          name: "Дизайн и UX",
          description: "Визуальное оформление, адаптивность, удобство использования",
          maxScore: 5,
          weight: 20,
          required: true,
        },
        {
          id: "c3",
          name: "Качество кода",
          description: "Читаемость, структура, соблюдение best practices",
          maxScore: 5,
          weight: 30,
          required: true,
        },
        {
          id: "c4",
          name: "Документация",
          description: "Полнота README, комментариев и инструкций по запуску",
          maxScore: 5,
          weight: 20,
          required: false,
        },
      ],
    },
    {
      id: "r2",
      name: "Проверка кода (Code Review)",
      description: "Рубрика для оценки качества программного кода",
      taskType: "code" as const,
      tags: ["программирование", "code-review"],
      teacherId: "u2",
      createdAt: new Date("2025-01-12"),
      updatedAt: new Date("2025-01-12"),
      criteria: [
        {
          id: "c1",
          name: "Корректность",
          description: "Код работает и решает поставленную задачу",
          maxScore: 5,
          required: true,
        },
        {
          id: "c2",
          name: "Читаемость",
          description: "Код легко читается и понимается",
          maxScore: 5,
          required: true,
        },
        {
          id: "c3",
          name: "Эффективность",
          description: "Оптимальность алгоритма и использования ресурсов",
          maxScore: 5,
          required: false,
        },
      ],
    },
    {
      id: "r3",
      name: "Эссе и письменные работы",
      description: "Критерии оценки текстовых работ и аналитических эссе",
      taskType: "text" as const,
      tags: ["письменные работы", "эссе", "аналитика"],
      teacherId: "u2",
      createdAt: new Date("2025-01-08"),
      updatedAt: new Date("2025-01-20"),
      criteria: [
        {
          id: "c1",
          name: "Структура и организация",
          description: "Логичность построения текста, наличие введения и заключения",
          maxScore: 5,
          required: true,
        },
        {
          id: "c2",
          name: "Аргументация",
          description: "Убедительность доводов и качество примеров",
          maxScore: 5,
          required: true,
          commentRequired: true,
        },
        {
          id: "c3",
          name: "Язык и стиль",
          description: "Грамотность, академический стиль, отсутствие ошибок",
          maxScore: 5,
          required: true,
        },
        {
          id: "c4",
          name: "Источники",
          description: "Использование и оформление источников",
          maxScore: 5,
          required: false,
        },
      ],
    },
  ];
};

export default function TeacherRubricsPage() {
  const [rubrics, setRubrics] = useState<RubricData[]>(getInitialRubrics);
  const [selectedRubricId, setSelectedRubricId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [searchQuery, setSearchQuery] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState<"all" | "text" | "code" | "project">("all");
  const [isAssignmentPickerOpen, setIsAssignmentPickerOpen] = useState(false);

  const selectedRubric = rubrics.find((r) => r.id === selectedRubricId) || null;

  // Save to localStorage whenever rubrics change
  useEffect(() => {
    localStorage.setItem(RUBRICS_STORAGE_KEY, JSON.stringify(rubrics));
  }, [rubrics]);

  // Filter rubrics
  const filteredRubrics = rubrics.filter((rubric) => {
    const matchesSearch =
      rubric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rubric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rubric.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = taskTypeFilter === "all" || rubric.taskType === taskTypeFilter;

    return matchesSearch && matchesType;
  });

  // Create new rubric
  const handleCreateNew = () => {
    const newRubric: RubricData = {
      id: `r${Date.now()}`,
      name: "Новая рубрика",
      description: "Описание рубрики",
      taskType: "project",
      tags: [],
      criteria: [
        {
          id: `c${Date.now()}`,
          name: "Критерий 1",
          description: "Описание критерия",
          maxScore: 5,
          required: true,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      teacherId: "u2",
    };
    setRubrics([newRubric, ...rubrics]);
    setSelectedRubricId(newRubric.id);
    setViewMode("edit");
  };

  // Duplicate rubric
  const handleDuplicate = (rubric: RubricData) => {
    const newId = crypto.randomUUID();
    const duplicated: RubricData = {
      ...rubric,
      id: `r${newId}`,
      name: `${rubric.name} (копия)`,
      criteria: rubric.criteria.map((c) => ({
        ...c,
        id: `c${crypto.randomUUID()}`,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRubrics([duplicated, ...rubrics]);
    setSelectedRubricId(duplicated.id);
    setViewMode("edit");
  };

  // Save rubric changes
  const handleSaveRubric = (updatedRubric: RubricData) => {
    setRubrics(
      rubrics.map((r) =>
        r.id === updatedRubric.id ? { ...updatedRubric, updatedAt: new Date() } : r,
      ),
    );
  };

  // Delete rubric
  const handleDeleteRubric = (rubricId: string) => {
    if (confirm("Удалить эту рубрику?")) {
      setRubrics(rubrics.filter((r) => r.id !== rubricId));
      if (selectedRubricId === rubricId) {
        setSelectedRubricId(null);
      }
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "text":
        return "Текст";
      case "code":
        return "Код";
      case "project":
        return "Проект";
      default:
        return type;
    }
  };

  return (
    <AppShell title="Библиотека рубрик">
      <Breadcrumbs
        items={[
          { label: "Дашборд преподавателя", href: ROUTES.teacherDashboard },
          { label: "Библиотека рубрик" },
        ]}
      />

      <div className="mt-6 grid grid-cols-[400px_1fr] gap-6 h-[calc(100vh-180px)]">
        {/* Left Column - Rubric List */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b-2 border-[#e6e8ee] flex items-center justify-between flex-shrink-0">
            <h2 className="text-[20px] font-medium text-[#21214f] tracking-[-0.5px]">
              Мои рубрики
            </h2>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-3 py-2 bg-[#2563eb] text-white rounded-[12px] hover:bg-[#1d4ed8] transition-colors text-[14px] font-medium"
            >
              <Plus className="w-4 h-4" />
              Создать
            </button>
          </div>

          {/* Search & Filters */}
          <div className="px-5 py-4 border-b-2 border-[#e6e8ee] space-y-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767692]" />
              <input
                type="text"
                placeholder="Поиск по названию, описанию, тегам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[14px] focus:outline-none focus:border-[#2563eb] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#767692]" />
              <select
                value={taskTypeFilter}
                onChange={(e) =>
                  setTaskTypeFilter(e.target.value as "all" | "text" | "code" | "project")
                }
                className="flex-1 px-3 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[14px] focus:outline-none focus:border-[#2563eb] transition-colors bg-white"
              >
                <option value="all">Все типы заданий</option>
                <option value="text">Текст</option>
                <option value="code">Код</option>
                <option value="project">Проект</option>
              </select>
            </div>
          </div>

          {/* Rubrics List */}
          <div className="flex-1 overflow-y-auto">
            {filteredRubrics.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
                <p className="text-[15px] text-[#767692]">
                  {searchQuery || taskTypeFilter !== "all"
                    ? "Рубрики не найдены"
                    : "Создайте первую рубрику"}
                </p>
              </div>
            )}

            {filteredRubrics.map((rubric, index) => (
              <div
                key={rubric.id}
                onClick={() => {
                  setSelectedRubricId(rubric.id);
                  setViewMode("edit");
                }}
                className={`
                  px-5 py-4 cursor-pointer transition-colors
                  ${index !== filteredRubrics.length - 1 ? "border-b border-[#e6e8ee]" : ""}
                  ${selectedRubricId === rubric.id ? "bg-[#eff6ff]" : "hover:bg-[#fafbfc]"}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[16px] font-medium text-[#21214f] tracking-[-0.3px]">
                    {rubric.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(rubric);
                    }}
                    className="p-1.5 hover:bg-white rounded-[6px] transition-colors"
                    title="Дублировать"
                  >
                    <Copy className="w-4 h-4 text-[#767692]" />
                  </button>
                </div>

                <p className="text-[13px] text-[#767692] mb-3 line-clamp-2">{rubric.description}</p>

                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="px-2 py-1 bg-white border border-[#e6e8ee] text-[#21214f] rounded-[6px] text-[12px] font-medium">
                    {getTaskTypeLabel(rubric.taskType)}
                  </span>
                  {rubric.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#dbeafe] text-[#1d4ed8] rounded-[6px] text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                  {rubric.tags.length > 2 && (
                    <span className="text-[11px] text-[#767692]">+{rubric.tags.length - 2}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[12px] text-[#767692]">
                  <span>{rubric.criteria.length} критериев</span>
                  <span>Обновлено {rubric.updatedAt.toLocaleDateString("ru-RU")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Rubric Editor/Preview */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] flex flex-col overflow-hidden">
          {!selectedRubric ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-[400px]">
                <div className="w-16 h-16 bg-[#f9f9f9] rounded-[16px] flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-[#767692]" />
                </div>
                <h3 className="text-[20px] font-medium text-[#21214f] mb-2 tracking-[-0.5px]">
                  Выберите рубрику
                </h3>
                <p className="text-[15px] text-[#767692] mb-6">
                  Выберите рубрику из списка слева или создайте новую
                </p>
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-3 bg-[#2563eb] text-white rounded-[12px] hover:bg-[#1d4ed8] transition-colors font-medium"
                >
                  Создать рубрику
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b-2 border-[#e6e8ee] flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-[20px] font-medium text-[#21214f] tracking-[-0.5px]">
                    {viewMode === "edit" ? "Редактирование" : "Предпросмотр"}
                  </h2>
                  <div className="flex items-center gap-1 bg-[#f9f9f9] rounded-[8px] p-1">
                    <button
                      onClick={() => setViewMode("edit")}
                      className={`
                        px-3 py-1 rounded-[6px] text-[13px] font-medium transition-colors
                        ${viewMode === "edit" ? "bg-white text-[#21214f] shadow-sm" : "text-[#767692]"}
                      `}
                    >
                      <Edit className="w-3 h-3 inline-block mr-1" />
                      Редактор
                    </button>
                    <button
                      onClick={() => setViewMode("preview")}
                      className={`
                        px-3 py-1 rounded-[6px] text-[13px] font-medium transition-colors
                        ${viewMode === "preview" ? "bg-white text-[#21214f] shadow-sm" : "text-[#767692]"}
                      `}
                    >
                      <Eye className="w-3 h-3 inline-block mr-1" />
                      Превью
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteRubric(selectedRubric.id)}
                    className="px-3 py-2 border-2 border-[#e6e8ee] text-[#d4183d] rounded-[12px] hover:border-[#d4183d] hover:bg-[#fff5f5] transition-colors text-[14px] font-medium"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {viewMode === "edit" ? (
                  <RubricEditor rubric={selectedRubric} onSave={handleSaveRubric} />
                ) : (
                  <RubricPreview rubric={selectedRubric} />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Assignment Picker Modal */}
      {isAssignmentPickerOpen && selectedRubric && (
        <AssignmentPickerModal
          rubricId={selectedRubric.id}
          rubricName={selectedRubric.name}
          onClose={() => setIsAssignmentPickerOpen(false)}
        />
      )}
    </AppShell>
  );
}
