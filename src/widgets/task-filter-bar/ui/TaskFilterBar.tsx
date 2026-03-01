import { useState } from "react";

import { TaskFilters } from "@/features/assignment/filter";
import type { TaskFilter } from "@/features/assignment/filter";
import type { Task } from "@/features/assignment/list";
import { TaskSearch } from "@/features/assignment/search";

interface TaskFilterBarProps {
  tasks: Task[];
  children: (filteredTasks: Task[]) => React.ReactNode;
}

export function TaskFilterBar({ tasks, children }: TaskFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (activeFilter === "due-soon") {
      return ["NOT_STARTED", "SUBMITTED", "PEER_REVIEW"].includes(task.status);
    }
    if (activeFilter === "completed") {
      return task.status === "GRADED";
    }

    return true;
  });

  return (
    <>
      <TaskSearch value={searchQuery} onChange={setSearchQuery} />
      <TaskFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      {children(filteredTasks)}
    </>
  );
}
