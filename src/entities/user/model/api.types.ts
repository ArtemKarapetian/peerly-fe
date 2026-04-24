/** Backend response types for students/teachers (snake_case) */

export interface ApiStudent {
  student_id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
}

export interface ApiTeacher {
  teacher_id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
}

export interface ApiUpdateProfilePayload {
  name?: string;
  email?: string;
  avatar?: string;
}
