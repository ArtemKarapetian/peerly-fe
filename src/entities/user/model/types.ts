export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "Student" | "Teacher" | "Admin";
  avatar?: string;
  createdAt: Date;
}
