import type { Assignment } from "@/entities/assignment";

import { AssignmentMetricRow } from "./AssignmentMetricRow";
import { DraftActions } from "./DraftActions";
import { PublishedStatusBadge } from "./PublishedStatusBadge";

interface AssignmentHeaderCardProps {
  assignment: Assignment;
  courseName: string;
  submittedCount: number;
  isPublished: boolean;
  deleting: boolean;
  onDelete: () => void;
}

export function AssignmentHeaderCard({
  assignment,
  courseName,
  submittedCount,
  isPublished,
  deleting,
  onDelete,
}: AssignmentHeaderCardProps) {
  const reviewsTotal = submittedCount * assignment.reviewCount;

  return (
    <div className="mt-6 bg-card border border-border shadow-sm rounded-xl p-6">
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-[28px] desktop:text-page-h1 font-medium text-foreground tracking-[-0.5px]">
              {assignment.title}
            </h1>
            <PublishedStatusBadge isPublished={isPublished} />
          </div>
          {courseName && <p className="text-15 text-muted-foreground mb-3">{courseName}</p>}
          {assignment.description && (
            <p className="text-15 text-foreground leading-[1.6] max-w-[800px]">
              {assignment.description}
            </p>
          )}
        </div>
        {!isPublished && (
          <DraftActions assignmentId={assignment.id} deleting={deleting} onDelete={onDelete} />
        )}
      </div>

      <AssignmentMetricRow
        submittedCount={submittedCount}
        reviewCount={assignment.reviewCount}
        reviewsTotal={reviewsTotal}
      />
    </div>
  );
}
