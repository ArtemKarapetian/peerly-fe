import { Plus, Calendar, Users, FileText } from "lucide-react";
import { useCallback } from "react";

import { assignmentRepo } from "@/entities/assignment";

interface TeacherCourseAssignmentsProps {
  courseId: string;
}

export function TeacherCourseAssignments({ courseId }: TeacherCourseAssignmentsProps) {
  const assignments = assignmentRepo.getByCourse(courseId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[12px] font-medium">
            Опубликовано
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 bg-[#f5f5f5] text-[#767692] rounded-[6px] text-[12px] font-medium">
            Черновик
          </span>
        );
      case "closed":
        return (
          <span className="px-2 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[6px] text-[12px] font-medium">
            Закрыто
          </span>
        );
      default:
        return null;
    }
  };

  const handleAssignmentClick = useCallback((assignmentId: string) => {
    window.location.hash = `/teacher/assignment/${assignmentId}`;
  }, []);

  const handleCreateAssignment = () => {
    window.location.hash = `/teacher/assignments/new`;
  };

  const handleKeyDown = (e: React.KeyboardEvent, assignmentId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAssignmentClick(assignmentId);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[15px] text-[#767692]">
          Всего заданий: <strong className="text-[#21214f]">{assignments.length}</strong>
        </p>
        <button
          onClick={handleCreateAssignment}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-[12px] hover:bg-[#1d4ed8] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Создать задание
        </button>
      </div>

      <div className="space-y-0">
        {assignments.map((assignment, index) => (
          <button
            key={assignment.id}
            className={`w-full text-left p-4 hover:bg-white hover:shadow-sm hover:rounded-[12px] transition-all cursor-pointer group ${
              index !== assignments.length - 1 ? "border-b border-[#e6e8ee]" : ""
            }`}
            onClick={() => handleAssignmentClick(assignment.id)}
            onKeyDown={(e) => handleKeyDown(e, assignment.id)}
            tabIndex={0}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[17px] font-medium text-[#21214f]">{assignment.title}</h3>
              {getStatusBadge(assignment.status)}
            </div>
            <p className="text-[14px] text-[#767692] mb-3">{assignment.description}</p>
            <div className="flex items-center gap-4 text-[13px] text-[#767692]">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {assignment.dueDate.toLocaleDateString("ru-RU")}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {assignment.reviewCount} рецензий
              </span>
            </div>
          </button>
        ))}

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
            <p className="text-[15px] text-[#767692] mb-4">Заданий пока нет</p>
            <button
              onClick={handleCreateAssignment}
              className="px-4 py-2 bg-[#2563eb] text-white rounded-[12px] hover:bg-[#1d4ed8] transition-colors"
            >
              Создать первое задание
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
