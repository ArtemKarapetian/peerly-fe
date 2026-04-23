import type { CreateGroupInput, DemoGroup, GroupParticipants } from "../model/types";

const demoGroups: DemoGroup[] = [
  { id: "1", name: "Группа 1", courseId: "c1" },
  { id: "2", name: "Группа 1", courseId: "c2" },
  { id: "3", name: "Группа 1", courseId: "c3" },
];

const demoParticipants: GroupParticipants = {
  students: [
    { id: "u1", userName: "Иван Петров" },
    { id: "u3", userName: "Анна Сидорова" },
  ],
  teachers: [{ id: "u2", userName: "Мария Иванова" }],
};

export const groupRepo = {
  listForCourse: (courseId: string): Promise<DemoGroup[]> =>
    Promise.resolve(demoGroups.filter((g) => g.courseId === courseId)),
  getById: (id: string): Promise<DemoGroup | undefined> =>
    Promise.resolve(demoGroups.find((g) => g.id === id)),
  getParticipants: (_groupId: string): Promise<GroupParticipants> =>
    Promise.resolve(demoParticipants),
  create: (input: CreateGroupInput): Promise<DemoGroup> => {
    const g: DemoGroup = { id: `g${Date.now()}`, name: input.name, courseId: input.courseId };
    demoGroups.push(g);
    return Promise.resolve(g);
  },
  update: (groupId: string, input: CreateGroupInput): Promise<void> => {
    const g = demoGroups.find((x) => x.id === groupId);
    if (g) {
      g.name = input.name;
      g.courseId = input.courseId;
    }
    return Promise.resolve();
  },
  delete: (groupId: string): Promise<void> => {
    const idx = demoGroups.findIndex((g) => g.id === groupId);
    if (idx !== -1) demoGroups.splice(idx, 1);
    return Promise.resolve();
  },
  addStudent: (_groupId: string, _studentId: string): Promise<void> => Promise.resolve(),
  addTeacher: (_groupId: string, _teacherId: string): Promise<void> => Promise.resolve(),
};
