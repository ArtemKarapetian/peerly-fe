import { TaskList } from "@/features/assignment/list";

import { TaskFilterBar } from "@/widgets/task-filter-bar";

import { mockTasks } from "../model/mockTasks";

interface CourseAssignmentsTabProps {
  courseId: string;
}

export function CourseAssignmentsTab({ courseId }: CourseAssignmentsTabProps) {
  const handleTaskClick = (taskId: string) => {
    window.location.hash = `/task/${taskId}`;
  };

  return (
    <div className="bg-[#f9f9f9] rounded-[20px] p-5 space-y-3 mt-2">
      <TaskFilterBar tasks={mockTasks}>
        {(filteredTasks) => (
          <TaskList tasks={filteredTasks} onTaskClick={handleTaskClick} courseId={courseId} />
        )}
      </TaskFilterBar>
    </div>
  );
}
