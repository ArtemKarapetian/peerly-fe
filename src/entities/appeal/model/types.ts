export interface DemoAppeal {
  id: string;
  reviewId: string;
  studentId: string;
  reason: string;
  status: "open" | "resolved" | "rejected";
  createdAt: Date;
}
