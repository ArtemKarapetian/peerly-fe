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
      {/* Toolbar: search left, segmented filter right — one row on desktop */}
      <div className="mb-4 flex flex-col gap-2.5 tablet:flex-row tablet:items-center tablet:gap-4">
        <div className="flex-1">
          <CourseSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
        <CourseFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>
      {children(filteredCourses)}
    </>
  );
}
