import { env } from "@/shared/config/env";

import { groupRepo as demoRepo } from "./api/demoRepo";
import { groupHttpRepo } from "./api/httpRepo";

export type { DemoGroup, CreateGroupInput, GroupParticipants, Participant } from "./model/types";
export const groupRepo = env.apiUrl ? groupHttpRepo : demoRepo;
