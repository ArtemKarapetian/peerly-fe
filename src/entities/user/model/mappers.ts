import type { ApiStudent, ApiTeacher } from "./api.types";
import type { DemoUser } from "./types";

export function mapApiStudent(api: ApiStudent): DemoUser {
  return {
    id: api.student_id,
    email: api.email,
    name: api.name,
    role: "Student",
    orgId: api.org_id ?? "",
    avatar: api.avatar,
    createdAt: new Date(api.created_at),
  };
}

export function mapApiTeacher(api: ApiTeacher): DemoUser {
  return {
    id: api.teacher_id,
    email: api.email,
    name: api.name,
    role: "Teacher",
    orgId: api.org_id ?? "",
    avatar: api.avatar,
    createdAt: new Date(api.created_at),
  };
}
