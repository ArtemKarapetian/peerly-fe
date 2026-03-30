import { Search, Plus, Filter, Copy, Eye, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AssignmentPickerModal } from "@/features/assignment/pick";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { RubricEditor, RubricPreview } from "@/widgets/rubric-editor";
import type { RubricData, RubricCriterionData } from "@/widgets/rubric-editor/model/types";

/**
 * TeacherRubricsPage - Библиотека рубрик
 *
 * Двухколоночный layout:
 * - Слева: список рубрик с поиском и фильтрами
 * - Справа: редактор/просмотр рубрики
 */

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
  const { t } = useTranslation();
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
      name: t("teacher.rubrics.newRubricName"),
      description: t("teacher.rubrics.newRubricDesc"),
      taskType: "project",
      tags: [],
      criteria: [
        {
          id: `c${Date.now()}`,
          name: t("teacher.rubrics.newCriterionName"),
          description: t("teacher.rubrics.newCriterionDesc"),
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
      name: `${rubric.name} ${t("teacher.rubrics.copySuffix")}`,
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
    if (confirm(t("teacher.rubrics.deleteConfirm"))) {
      setRubrics(rubrics.filter((r) => r.id !== rubricId));
      if (selectedRubricId === rubricId) {
        setSelectedRubricId(null);
      }
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "text":
        return t("teacher.rubrics.typeText");
      case "code":
        return t("teacher.rubrics.typeCode");
      case "project":
        return t("teacher.rubrics.typeProject");
      default:
        return type;
    }
  };

  return (
    <AppShell title={t("teacher.rubrics.title")}>
      <Breadcrumbs items={[{ label: t("teacher.rubrics.breadcrumb") }]} />

      <div className="mt-6 grid grid-cols-[400px_1fr] gap-6 h-[calc(100vh-180px)]">
        {/* Left Column - Rubric List */}
        <div className="bg-card border-2 border-border rounded-[20px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b-2 border-border flex items-center justify-between flex-shrink-0">
            <h2 className="text-[20px] font-medium text-foreground tracking-[-0.5px]">
              {t("teacher.rubrics.myRubrics")}
            </h2>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-3 py-2 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
            >
              <Plus className="w-4 h-4" />
              {t("teacher.rubrics.create")}
            </button>
          </div>

          {/* Search & Filters */}
          <div className="px-5 py-4 border-b-2 border-border space-y-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("teacher.rubrics.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border-2 border-border rounded-[12px] text-[14px] focus:outline-none focus:border-ring transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={taskTypeFilter}
                onChange={(e) =>
                  setTaskTypeFilter(e.target.value as "all" | "text" | "code" | "project")
                }
                className="flex-1 px-3 py-2 border-2 border-border rounded-[12px] text-[14px] focus:outline-none focus:border-ring transition-colors bg-card"
              >
                <option value="all">{t("teacher.rubrics.allTaskTypes")}</option>
                <option value="text">{t("teacher.rubrics.typeText")}</option>
                <option value="code">{t("teacher.rubrics.typeCode")}</option>
                <option value="project">{t("teacher.rubrics.typeProject")}</option>
              </select>
            </div>
          </div>

          {/* Rubrics List */}
          <div className="flex-1 overflow-y-auto">
            {filteredRubrics.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                <p className="text-[15px] text-muted-foreground">
                  {searchQuery || taskTypeFilter !== "all"
                    ? t("teacher.rubrics.notFound")
                    : t("teacher.rubrics.createFirst")}
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
                  ${index !== filteredRubrics.length - 1 ? "border-b border-border" : ""}
                  ${selectedRubricId === rubric.id ? "bg-info-light" : "hover:bg-surface-hover"}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[16px] font-medium text-foreground tracking-[-0.3px]">
                    {rubric.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(rubric);
                    }}
                    className="p-1.5 hover:bg-card rounded-[6px] transition-colors"
                    title={t("teacher.rubrics.duplicate")}
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <p className="text-[13px] text-muted-foreground mb-3 line-clamp-2">
                  {rubric.description}
                </p>

                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="px-2 py-1 bg-card border border-border text-foreground rounded-[6px] text-[12px] font-medium">
                    {getTaskTypeLabel(rubric.taskType)}
                  </span>
                  {rubric.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-info-light text-brand-primary rounded-[6px] text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                  {rubric.tags.length > 2 && (
                    <span className="text-[11px] text-muted-foreground">
                      +{rubric.tags.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                  <span>
                    {rubric.criteria.length} {t("teacher.rubrics.criteriaCount")}
                  </span>
                  <span>
                    {t("teacher.rubrics.updated")} {rubric.updatedAt.toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Rubric Editor/Preview */}
        <div className="bg-card border-2 border-border rounded-[20px] flex flex-col overflow-hidden">
          {!selectedRubric ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-[400px]">
                <div className="w-16 h-16 bg-muted rounded-[16px] flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-[20px] font-medium text-foreground mb-2 tracking-[-0.5px]">
                  {t("teacher.rubrics.selectRubric")}
                </h3>
                <p className="text-[15px] text-muted-foreground mb-6">
                  {t("teacher.rubrics.selectRubricHint")}
                </p>
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium"
                >
                  {t("teacher.rubrics.createRubric")}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b-2 border-border flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-[20px] font-medium text-foreground tracking-[-0.5px]">
                    {viewMode === "edit"
                      ? t("teacher.rubrics.editing")
                      : t("teacher.rubrics.preview")}
                  </h2>
                  <div className="flex items-center gap-1 bg-muted rounded-[8px] p-1">
                    <button
                      onClick={() => setViewMode("edit")}
                      className={`
                        px-3 py-1 rounded-[6px] text-[13px] font-medium transition-colors
                        ${viewMode === "edit" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}
                      `}
                    >
                      <Edit className="w-3 h-3 inline-block mr-1" />
                      {t("teacher.rubrics.editor")}
                    </button>
                    <button
                      onClick={() => setViewMode("preview")}
                      className={`
                        px-3 py-1 rounded-[6px] text-[13px] font-medium transition-colors
                        ${viewMode === "preview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}
                      `}
                    >
                      <Eye className="w-3 h-3 inline-block mr-1" />
                      {t("teacher.rubrics.previewTab")}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteRubric(selectedRubric.id)}
                    className="px-3 py-2 border-2 border-border text-error rounded-[12px] hover:border-error hover:bg-error-light transition-colors text-[14px] font-medium"
                  >
                    {t("teacher.rubrics.deleteBtn")}
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
