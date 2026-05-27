import { Plus, Calendar, Users, FileText } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { useAsync } from "@/shared/lib/useAsync";

import { assignmentRepo } from "@/entities/assignment";

interface TeacherCourseAssignmentsProps {
  courseId: string;
}

export function TeacherCourseAssignments({ courseId }: TeacherCourseAssignmentsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: assignments, isLoading } = useAsync(
    () => assignmentRepo.getByCourse(courseId),
    [courseId],
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="px-2 py-1 bg-success-light text-success rounded-2sm text-xs font-medium">
            {t("widget.assignments.published")}
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 bg-muted text-muted-foreground rounded-2sm text-xs font-medium">
            {t("widget.assignments.draft")}
          </span>
        );
      case "closed":
        return (
          <span className="px-2 py-1 bg-error-light text-error rounded-2sm text-xs font-medium">
            {t("widget.assignments.closed")}
          </span>
        );
      default:
        return null;
    }
  };

  const handleAssignmentClick = useCallback(
    (assignmentId: string) => {
      void navigate(`/teacher/assignment/${assignmentId}`);
    },
    [navigate],
  );

  const handleCreateAssignment = () => {
    void navigate(`${ROUTES.teacherCreateAssignment}?courseId=${courseId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, assignmentId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAssignmentClick(assignmentId);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("widget.assignments.loading")}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-15 text-muted-foreground">
          {t("widget.assignments.totalAssignments")}{" "}
          <strong className="text-foreground">{(assignments ?? []).length}</strong>
        </p>
        <button
          onClick={handleCreateAssignment}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-inverse rounded-md hover:bg-brand-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("widget.assignments.createAssignment")}
        </button>
      </div>

      <div className="space-y-0">
        {(assignments ?? []).map((assignment, index) => (
          <button
            key={assignment.id}
            className={`w-full text-left p-4 hover:bg-card hover:shadow-sm hover:rounded-md transition-all cursor-pointer group ${
              index !== (assignments ?? []).length - 1 ? "border-b border-border" : ""
            }`}
            onClick={() => handleAssignmentClick(assignment.id)}
            onKeyDown={(e) => handleKeyDown(e, assignment.id)}
            tabIndex={0}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[17px] font-medium text-foreground">{assignment.title}</h3>
              {getStatusBadge(assignment.status)}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
            <div className="flex items-center gap-4 text-13 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {assignment.dueDate.toLocaleDateString("ru-RU")}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {assignment.reviewCount}{" "}
                {t("widget.assignments.reviews", { count: assignment.reviewCount })}
              </span>
            </div>
          </button>
        ))}

        {(assignments ?? []).length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-15 text-muted-foreground">{t("widget.assignments.noAssignments")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
