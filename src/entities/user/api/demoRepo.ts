import { DemoUser } from "../model/types";

const demoUsers: DemoUser[] = [
  {
    id: "u1",
    email: "student@peerly.ru",
    name: "Иван Петров",
    role: "Student",
    orgId: "org1",
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "u2",
    email: "teacher@peerly.ru",
    name: "Мария Сидорова",
    role: "Teacher",
    orgId: "org1",
    createdAt: new Date("2023-01-20"),
  },
  {
    id: "u3",
    email: "admin@peerly.ru",
    name: "Алексей Смирнов",
    role: "Admin",
    orgId: "org1",
    createdAt: new Date("2023-01-15"),
  },
];

export const userRepo = {
  getAll: (): DemoUser[] => demoUsers,
  getById: (id: string): DemoUser | undefined => demoUsers.find((u) => u.id === id),
};
