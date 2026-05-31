import type { Id } from "./common";

export interface StudentDto {
  studentId: Id;
  email: string;
  name: string;
}

export interface TeacherDto {
  teacherId: Id;
  email: string;
  name: string;
}

export interface ListParticipantsResponse {
  students: StudentDto[];
  teachers: TeacherDto[];
}
