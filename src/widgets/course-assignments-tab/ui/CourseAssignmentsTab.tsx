import { useNavigate } from "react-router-dom";

import { TaskList } from "@/features/assignment/list";

import { TaskFilterBar } from "@/widgets/task-filter-bar";

import { mockTasks } from "../model/mockTasks";

interface CourseAssignmentsTabProps {
  courseId: string;
}

export function CourseAssignmentsTab({ courseId }: CourseAssignmentsTabProps) {
  const navigate = useNavigate();
  const handleTaskClick = (taskId: string) => {
    void navigate(`/student/courses/${courseId}/tasks/${taskId}`);
  };

  return (
    <div className="space-y-3">
      <TaskFilterBar tasks={mockTasks}>
        {(filteredTasks) => (
          <TaskList tasks={filteredTasks} onTaskClick={handleTaskClick} courseId={courseId} />
        )}
      </TaskFilterBar>
    </div>
  );
}
