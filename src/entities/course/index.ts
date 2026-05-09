export type { DemoCourse, CreateCourseInput } from "./model/types";
export { courseHttpRepo as courseRepo } from "./api/httpRepo";
export { CourseCard } from "./ui/CourseCard";
export { CourseHeader } from "./ui/CourseHeader";
export { CourseTabs } from "./ui/CourseTabs";
export {
  useCourses,
  useCourse,
  useCreateCourse,
  useArchiveCourse,
  useCourseParticipants,
} from "./model/queries";
