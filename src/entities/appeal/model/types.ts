export interface DemoAppeal {
  id: string;
  reviewId: string;
  studentId: string;
  reason: string;
  status: "open" | "resolved" | "rejected";
  createdAt: Date;
}

export type AppealStatus = "new" | "in_review" | "resolved";
export type AppealReason = "unfair_score" | "wrong_interpretation" | "technical_issue" | "other";

export interface Appeal {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  taskId: string;
  taskName: string;

  // Appeal details
  reason: AppealReason;
  message: string;
  attachmentName?: string; // Demo only

  // Context from work
  currentScore?: number;
  maxScore?: number;
  reviewCount?: number;

  // Status tracking
  status: AppealStatus;
  createdAt: string;
  updatedAt: string;

  // Teacher response (for future implementation)
  teacherResponse?: {
    message: string;
    respondedBy: string;
    respondedAt: string;
    newScore?: number;
  };
}

export type CreateAppealInput = Omit<Appeal, "id" | "status" | "createdAt" | "updatedAt">;
