import { env } from "@/shared/config/env";

import { userRepo as demoRepo } from "./api/demoRepo";
import { userHttpRepo } from "./api/httpRepo";

export type { DemoUser } from "./model/types";
export { AuthProvider, useAuth } from "./model/auth";
export { RoleProvider, useRole, getRoleDisplayName, getRoleBadgeColor } from "./model/role";
export type { UserRole } from "./model/role";
export const userRepo = env.apiUrl ? userHttpRepo : demoRepo;
export { ParticipantsList } from "./ui/ParticipantsList";
export type { Participant } from "./ui/ParticipantsList";
