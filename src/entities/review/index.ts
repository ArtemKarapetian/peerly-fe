import { env } from "@/shared/config/env";

import { reviewRepo as demoRepo } from "./api/demoRepo";
import { reviewHttpRepo } from "./api/httpRepo";

export type {
  DemoReview,
  ReviewAssignment,
  ReviewStatus,
  CriterionScore,
  ReviewDraft,
} from "./model/types";
export { useReviewStore } from "./api/reviewRepo.mock";
export const reviewRepo = env.apiUrl ? reviewHttpRepo : demoRepo;
