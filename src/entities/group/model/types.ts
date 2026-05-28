export interface DemoGroup {
  id: string;
  name: string;
  studentCount: number;
}

export interface CreateGroupInput {
  courseId: string;
  name: string;
}

export interface UpdateGroupInput {
  name: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface GroupParticipants {
  students: Participant[];
  teachers: Participant[];
}
