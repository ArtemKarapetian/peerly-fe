import { env } from "@/shared/config/env";

import { assignmentRepo as demoRepo } from "./api/demoRepo";
import { assignmentHttpRepo } from "./api/httpRepo";

export type { DemoAssignment } from "./model/types";
export const assignmentRepo = env.apiUrl ? assignmentHttpRepo : demoRepo;
export { TaskListItem } from "./ui/TaskListItem";
export { StatusCard } from "./ui/StatusCard";
export type { TaskStatus } from "./ui/StatusCard";
