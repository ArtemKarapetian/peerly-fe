import type { ApiStudent, ApiTeacher } from "./api.types";
import type { DemoUser } from "./types";

export function mapApiStudent(api: ApiStudent): DemoUser {
  return {
    id: api.student_id,
    email: api.email,
    name: api.name,
    role: "Student",
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
    avatar: api.avatar,
    createdAt: new Date(api.created_at),
  };
}
