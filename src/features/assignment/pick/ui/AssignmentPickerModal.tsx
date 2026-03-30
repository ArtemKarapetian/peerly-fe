import { X, Search, CheckCircle, FileText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";

/**
 * AssignmentPickerModal - Модальное окно выбора задания для привязки рубрики
 *
 * Features:
 * - Список заданий из курсов преподавателя
 * - Поиск по названию
 * - Фильтр по курсу
 * - Привязка рубрики к выбранному заданию
 */

interface AssignmentPickerModalProps {
  rubricId: string;
  rubricName: string;
  onClose: () => void;
}

export function AssignmentPickerModal({
  rubricId: _rubricId,
  rubricName,
  onClose,
}: AssignmentPickerModalProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  // Get courses and assignments
  const { data: fetchedData } = useAsync(
    () => Promise.all([courseRepo.getAll(), assignmentRepo.getAll()]),
    [],
  );
  const courses = fetchedData?.[0] ?? [];
  const assignments = fetchedData?.[1] ?? [];

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourseId === "all" || assignment.courseId === selectedCourseId;
    return matchesSearch && matchesCourse;
  });

  const handleAttach = () => {
    if (!selectedAssignmentId) {
      alert(t("feature.assignmentPicker.selectAssignment"));
      return;
    }

    const assignment = assignments.find((a) => a.id === selectedAssignmentId);
    if (assignment) {
      alert(
        t("feature.assignmentPicker.rubricAttached", {
          rubricName,
          assignmentTitle: assignment.title,
        }),
      );
      onClose();
    }
  };

  const getCourseById = (courseId: string) => {
    return courses.find((c) => c.id === courseId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="px-2 py-1 bg-success-light text-success rounded-[6px] text-[11px] font-medium">
            {t("feature.assignmentPicker.published")}
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 bg-muted text-muted-foreground rounded-[6px] text-[11px] font-medium">
            {t("feature.assignmentPicker.draft")}
          </span>
        );
      case "closed":
        return (
          <span className="px-2 py-1 bg-error-light text-destructive rounded-[6px] text-[11px] font-medium">
            {t("feature.assignmentPicker.closed")}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-[20px] w-full max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-border">
          <div>
            <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px]">
              {t("feature.assignmentPicker.title")}
            </h2>
            <p className="text-[14px] text-muted-foreground mt-1">
              {t("feature.assignmentPicker.rubricLabel")}:{" "}
              <span className="font-medium text-foreground">{rubricName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-[8px] transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b-2 border-border space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("feature.assignmentPicker.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border-2 border-border rounded-[12px] text-[14px] focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>

          {/* Course Filter */}
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-3 py-2 border-2 border-border rounded-[12px] text-[14px] focus:outline-none focus:border-brand-primary transition-colors bg-card"
          >
            <option value="all">{t("feature.assignmentPicker.allCourses")}</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>

        {/* Assignments List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <p className="text-[15px] text-muted-foreground">
                {t("feature.assignmentPicker.notFound")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAssignments.map((assignment) => {
                const course = getCourseById(assignment.courseId);
                const isSelected = selectedAssignmentId === assignment.id;
                const hasRubric = assignment.rubricId;

                return (
                  <button
                    key={assignment.id}
                    onClick={() => setSelectedAssignmentId(assignment.id)}
                    className={`
                      w-full text-left p-4 border-2 rounded-[12px] transition-all
                      ${
                        isSelected
                          ? "border-brand-primary bg-brand-primary-light"
                          : "border-border hover:border-brand-primary bg-card"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[16px] font-medium text-foreground">
                            {assignment.title}
                          </h3>
                          {isSelected && <CheckCircle className="w-4 h-4 text-brand-primary" />}
                        </div>

                        <p className="text-[13px] text-muted-foreground mb-2">
                          {course?.name} • {assignment.description}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(assignment.status)}
                          <span className="text-[12px] text-muted-foreground">
                            {t("feature.assignmentPicker.deadline")}:{" "}
                            {assignment.dueDate.toLocaleDateString("ru-RU")}
                          </span>
                          {hasRubric && (
                            <span className="px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[11px] font-medium">
                              {t("feature.assignmentPicker.hasRubric")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t-2 border-border">
          <p className="text-[13px] text-muted-foreground">
            {selectedAssignmentId
              ? t("feature.assignmentPicker.clickAttach")
              : t("feature.assignmentPicker.selectFromList")}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-[12px] transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleAttach}
              disabled={!selectedAssignmentId}
              className="px-6 py-2 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium disabled:bg-muted disabled:cursor-not-allowed"
            >
              {t("feature.assignmentPicker.attach")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
