import type { Id } from "./common";

export type Role = "Student" | "Teacher" | "Admin";

export interface LoginResponseBody {
  userId: Id;
}

export interface RegisterResponseBody {
  userId: Id;
}
