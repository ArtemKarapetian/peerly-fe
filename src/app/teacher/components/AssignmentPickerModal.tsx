import { useState } from "react";
import { X, Search, CheckCircle, FileText } from "lucide-react";
import { demoDataStore } from "@/app/stores/demoDataStore";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  // Get courses and assignments
  const courses = demoDataStore.getCourses();
  const assignments = demoDataStore.getAssignments();

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourseId === "all" || assignment.courseId === selectedCourseId;
    return matchesSearch && matchesCourse;
  });

  const handleAttach = () => {
    if (!selectedAssignmentId) {
      alert("Выберите задание");
      return;
    }

    const assignment = assignments.find((a) => a.id === selectedAssignmentId);
    if (assignment) {
      alert(`Рубрика "${rubricName}" успешно привязана к заданию "${assignment.title}"`);
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
          <span className="px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
            Опубликовано
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 bg-[#f5f5f5] text-[#767692] rounded-[6px] text-[11px] font-medium">
            Черновик
          </span>
        );
      case "closed":
        return (
          <span className="px-2 py-1 bg-[#ffe9e9] text-[#d4183d] rounded-[6px] text-[11px] font-medium">
            Закрыто
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#e6e8ee]">
          <div>
            <h2 className="text-[24px] font-medium text-[#21214f] tracking-[-0.5px]">
              Привязать рубрику к заданию
            </h2>
            <p className="text-[14px] text-[#767692] mt-1">
              Рубрика: <span className="font-medium text-[#21214f]">{rubricName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-[8px] transition-colors"
          >
            <X className="w-5 h-5 text-[#767692]" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b-2 border-[#e6e8ee] space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767692]" />
            <input
              type="text"
              placeholder="Поиск по названию задания..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[14px] focus:outline-none focus:border-[#5b8def] transition-colors"
            />
          </div>

          {/* Course Filter */}
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-3 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[14px] focus:outline-none focus:border-[#5b8def] transition-colors bg-white"
          >
            <option value="all">Все курсы</option>
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
              <FileText className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <p className="text-[15px] text-[#767692]">Задания не найдены</p>
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
                          ? "border-[#5b8def] bg-[#e9f5ff]"
                          : "border-[#e6e8ee] hover:border-[#a0b8f1] bg-white"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[16px] font-medium text-[#21214f]">
                            {assignment.title}
                          </h3>
                          {isSelected && <CheckCircle className="w-4 h-4 text-[#5b8def]" />}
                        </div>

                        <p className="text-[13px] text-[#767692] mb-2">
                          {course?.name} • {assignment.description}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(assignment.status)}
                          <span className="text-[12px] text-[#767692]">
                            Дедлайн: {assignment.dueDate.toLocaleDateString("ru-RU")}
                          </span>
                          {hasRubric && (
                            <span className="px-2 py-1 bg-[#fff8e1] text-[#f57c00] rounded-[6px] text-[11px] font-medium">
                              Уже есть рубрика
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
        <div className="flex items-center justify-between gap-3 p-6 border-t-2 border-[#e6e8ee]">
          <p className="text-[13px] text-[#767692]">
            {selectedAssignmentId
              ? 'Нажмите "Привязать" для подтверждения'
              : "Выберите задание из списка выше"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#767692] hover:bg-[#f9f9f9] rounded-[12px] transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleAttach}
              disabled={!selectedAssignmentId}
              className="px-6 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors font-medium disabled:bg-[#d7d7d7] disabled:cursor-not-allowed"
            >
              Привязать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
