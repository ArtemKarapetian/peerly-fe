import { env } from "@/shared/config/env";

import { workRepo as demoRepo } from "./api/demoRepo";
import { workHttpRepo } from "./api/httpRepo";

export type { DemoSubmission } from "./model/types";
export const workRepo = env.apiUrl ? workHttpRepo : demoRepo;
export { VersionCard } from "./ui/VersionCard";
export { VersionTimeline } from "./ui/VersionTimeline";
export type { Version, VersionStatus } from "./ui/VersionCard";
