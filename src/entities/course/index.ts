import { env } from "@/shared/config/env";

import { courseRepo as demoRepo } from "./api/demoRepo";
import { courseHttpRepo } from "./api/httpRepo";

export type { DemoCourse, CreateCourseInput } from "./model/types";
export const courseRepo = env.apiUrl ? courseHttpRepo : demoRepo;
export { CourseCard } from "./ui/CourseCard";
export { CourseHeader } from "./ui/CourseHeader";
export { CourseTabs } from "./ui/CourseTabs";
export { useCourses, useCourse, useCreateCourse, useArchiveCourse } from "./model/queries";
