export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "Student" | "Teacher" | "Admin";
  orgId: string;
  avatar?: string;
  createdAt: Date;
}
