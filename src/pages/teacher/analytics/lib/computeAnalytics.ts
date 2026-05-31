import type {
  AnalyticsRawData,
  AssignmentMetrics,
  GradebookEntry,
  OverallMetrics,
  Student,
} from "../model/types";

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function truncate(s: string, n: number): string {
  return s.length > n ? s.substring(0, n) + "…" : s;
}

interface ComputeArgs {
  data: AnalyticsRawData;
  students: Student[];
  selectedCourseId: string;
  selectedAssignmentId?: string | null;
}

export function computeAssignmentMetrics({
  data,
  students,
  selectedCourseId,
  selectedAssignmentId,
}: ComputeArgs): AssignmentMetrics[] {
  const { assignments, submissions, reviews } = data;
  const courseAssignments = assignments
    .filter((a) => a.courseId === selectedCourseId)
    .filter((a) => !selectedAssignmentId || a.id === selectedAssignmentId);

  return courseAssignments.map((assignment) => {
    const assignmentSubmissions = submissions.filter((s) => s.assignmentId === assignment.id);
    const completed = assignmentSubmissions.filter(
      (s) => s.status === "submitted" || s.status === "reviewed",
    );
    const submissionRate = students.length > 0 ? (completed.length / students.length) * 100 : 0;

    const submittedReviews = reviews.filter(
      (r) => r.status === "submitted" && assignmentSubmissions.some((s) => s.id === r.submissionId),
    );
    const expectedReviews = completed.length * (assignment.reviewCount || 0);
    const reviewCompletionRate =
      expectedReviews > 0 ? (submittedReviews.length / expectedReviews) * 100 : 0;

    const scoreVals = submittedReviews.flatMap((r) => r.scores.map((s) => s.score));
    const avgScore = scoreVals.length > 0 ? mean(scoreVals) : 0;

    const discrepancies: number[] = [];
    for (const submission of completed) {
      const subReviewScores = submittedReviews
        .filter((r) => r.submissionId === submission.id)
        .map((r) => mean(r.scores.map((s) => s.score)))
        .filter((v) => Number.isFinite(v) && v > 0);
      if (subReviewScores.length >= 2) {
        discrepancies.push(Math.max(...subReviewScores) - Math.min(...subReviewScores));
      }
    }
    const avgDiscrepancy = discrepancies.length > 0 ? mean(discrepancies) : 0;

    return {
      id: assignment.id,
      title: assignment.title,
      shortTitle: truncate(assignment.title, 20),
      submissionRate,
      reviewCompletionRate,
      avgScore,
      avgDiscrepancy,
      hasDiscrepancyData: discrepancies.length > 0,
    };
  });
}

export function computeOverallMetrics(
  metrics: AssignmentMetrics[],
  totalAssignments: number,
): OverallMetrics {
  return {
    totalAssignments,
    avgSubmissionRate: mean(metrics.map((m) => m.submissionRate)),
    avgReviewCompletionRate: mean(metrics.map((m) => m.reviewCompletionRate)),
    avgScore: mean(metrics.map((m) => m.avgScore).filter((v) => v > 0)),
    avgDiscrepancy: mean(metrics.filter((m) => m.hasDiscrepancyData).map((m) => m.avgDiscrepancy)),
  };
}

interface GradebookArgs {
  data: AnalyticsRawData;
  students: Student[];
  selectedCourseId: string;
  selectedAssignmentId?: string | null;
}

export function computeGradebook({
  data,
  students,
  selectedCourseId,
  selectedAssignmentId,
}: GradebookArgs): GradebookEntry[] {
  const { assignments, submissions, reviews } = data;
  const courseAssignments = assignments
    .filter((a) => a.courseId === selectedCourseId)
    .filter((a) => !selectedAssignmentId || a.id === selectedAssignmentId);

  return students.map((student) => {
    const studentId = String(student.studentId);
    const scores: Record<string, number | null> = {};
    const earned: number[] = [];
    for (const assignment of courseAssignments) {
      const submission = submissions.find(
        (s) => s.assignmentId === assignment.id && s.studentId === studentId,
      );
      if (!submission || (submission.status !== "submitted" && submission.status !== "reviewed")) {
        scores[assignment.id] = null;
        continue;
      }
      const subReviews = reviews
        .filter((r) => r.submissionId === submission.id && r.status === "submitted")
        .flatMap((r) => r.scores.map((s) => s.score));
      if (subReviews.length === 0) {
        scores[assignment.id] = null;
        continue;
      }
      const rounded = Math.round(mean(subReviews) * 10) / 10;
      scores[assignment.id] = rounded;
      earned.push(rounded);
    }
    return {
      studentId,
      studentName: student.name,
      scores,
      finalScore: earned.length > 0 ? Math.round(mean(earned) * 10) / 10 : null,
    };
  });
}
