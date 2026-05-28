import type { reviewRepo } from "@/entities/review";
import type { workRepo } from "@/entities/work";

import type { DistributionRow, OverallStatus, ReviewerStatus } from "../model/types";

interface ComputeArgs {
  submissions: Awaited<ReturnType<typeof workRepo.getAll>>;
  reviews: Awaited<ReturnType<typeof reviewRepo.getAll>>;
  nameById: Map<string, string>;
  selectedAssignment: string;
  unknownReviewer: string;
  unknownAuthor: string;
}

export function computeDistributions({
  submissions,
  reviews,
  nameById,
  selectedAssignment,
  unknownReviewer,
  unknownAuthor,
}: ComputeArgs): DistributionRow[] {
  if (!selectedAssignment) return [];

  return submissions
    .filter((s) => s.assignmentId === selectedAssignment)
    .map((submission, idx) => {
      const submissionReviews = reviews.filter((r) => r.submissionId === submission.id);
      const assignedReviewers = submissionReviews.map((review) => ({
        id: review.reviewerId,
        name: nameById.get(review.reviewerId) || unknownReviewer,
        status: review.status as ReviewerStatus,
      }));
      const submittedCount = assignedReviewers.filter((r) => r.status === "submitted").length;
      let overallStatus: OverallStatus = "not-started";
      if (assignedReviewers.length > 0 && submittedCount === assignedReviewers.length) {
        overallStatus = "completed";
      } else if (submittedCount > 0) {
        overallStatus = "in-progress";
      }
      return {
        submissionId: submission.id,
        anonymousId: `SUB-${String(idx + 1).padStart(3, "0")}`,
        authorName: nameById.get(submission.studentId) || unknownAuthor,
        assignedReviewers,
        overallStatus,
      };
    });
}
