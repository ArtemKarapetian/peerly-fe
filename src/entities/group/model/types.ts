export interface DemoGroup {
  id: string;
  name: string;
  courseId: string;
}

export interface CreateGroupInput {
  courseId: string;
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
