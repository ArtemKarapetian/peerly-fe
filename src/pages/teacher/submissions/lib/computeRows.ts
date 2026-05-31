import type { RowStatus, SubmissionRow, SubmissionsRawData } from "../model/types";

function isLate(submittedAt: Date | undefined, deadline: Date | undefined): boolean {
  if (!submittedAt || !deadline) return false;
  return submittedAt.getTime() > deadline.getTime();
}

interface ComputeRowsArgs {
  data: SubmissionsRawData;
  unknownStudentLabel: string;
}

export function computeRows({ data, unknownStudentLabel }: ComputeRowsArgs): SubmissionRow[] {
  const { users, assignments, submissions } = data;
  return submissions.map((sub) => {
    const assignment = assignments.find((a) => a.id === sub.assignmentId);
    const student = users.find((u) => u.id === sub.studentId);
    const late = isLate(sub.submittedAt, assignment?.dueDate);
    const status: RowStatus = sub.status === "draft" ? "draft" : late ? "late" : "submitted";
    return {
      sub,
      assignment,
      studentName: student?.name ?? sub.studentName ?? unknownStudentLabel,
      status,
    };
  });
}
