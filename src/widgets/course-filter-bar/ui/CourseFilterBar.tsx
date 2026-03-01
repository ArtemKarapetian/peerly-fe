import React, { useState } from "react";

import { CourseFilters } from "@/features/course/filter";
import type { CourseFilterType } from "@/features/course/filter";
import { CourseSearch } from "@/features/course/search";

export interface FilterableCourse {
  title: string;
  teacher: string;
  status?: "active" | "completed";
}

interface CourseFilterBarProps<T extends FilterableCourse> {
  courses: T[];
  children: (filteredCourses: T[]) => React.ReactNode;
}

export function CourseFilterBar<T extends FilterableCourse>({
  courses,
  children,
}: CourseFilterBarProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CourseFilterType>("all");

  const filteredCourses = courses.filter((course) => {
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (activeFilter === "active" && course.status !== "active") return false;
    return !(activeFilter === "completed" && course.status !== "completed");
  });

  return (
    <>
      <div className="mb-6 space-y-4">
        <CourseSearch value={searchQuery} onChange={setSearchQuery} />
        <CourseFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>
      {children(filteredCourses)}
    </>
  );
}
