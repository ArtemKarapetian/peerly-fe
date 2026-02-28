import { DemoAuditLog } from "../model/types";

const demoAuditLogs: DemoAuditLog[] = [
  {
    id: "al1",
    userId: "u3",
    action: "UPDATE",
    resource: "Organization",
    timestamp: new Date("2025-01-24 14:32"),
    metadata: { orgId: "org1" },
  },
  {
    id: "al2",
    userId: "u2",
    action: "CREATE",
    resource: "Course",
    timestamp: new Date("2025-01-24 10:15"),
    metadata: { courseId: "c1" },
  },
  {
    id: "al3",
    userId: "u1",
    action: "SUBMIT",
    resource: "Review",
    timestamp: new Date("2025-01-24 09:42"),
    metadata: { reviewId: "rv1" },
  },
];

export const auditLogRepo = {
  getAll: (): DemoAuditLog[] => demoAuditLogs,
};
