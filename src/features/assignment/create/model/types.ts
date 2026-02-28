export interface AssignmentFormData {
  // Step 1: Basics
  courseId: string;
  title: string;
  description: string;
  taskType: "text" | "code" | "project" | "files";
  attachments: Array<{ id: string; name: string; url: string; size: number }>;

  // Step 2: Deadlines
  submissionDeadline: Date | null;
  reviewDeadline: Date | null;
  latePolicy: "soft" | "hard";
  latePenalty: number; // percentage per day
  timezone: string;

  // Step 3: Rubric
  rubricId: string | null;
  rubricName?: string;

  // Step 4: Peer Session
  reviewsPerSubmission: number;
  distributionMode: "random" | "skill-based" | "manual";
  anonymityMode: "full" | "partial" | "none";
  allowReassignment: boolean;
  reassignmentDeadline: Date | null;

  // Step 5: Plugins
  enablePlagiarismCheck: boolean;
  plagiarismThreshold: number;
  enableLinter: boolean;
  linterConfig: string;
  enableFormatCheck: boolean;
  formatRules: string[];
  enableAnonymization: boolean;

  // Metadata
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}
