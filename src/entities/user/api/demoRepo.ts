import { DemoUser } from "../model/types";

const demoUsers: DemoUser[] = [
  // ── Faculty ───────────────────────────────────────────────────────
  {
    id: "u2",
    email: "teacher@peerly.ru",
    name: "Мария Сидорова",
    role: "Teacher",
    createdAt: new Date("2023-01-20"),
  },
  {
    id: "u3",
    email: "admin@peerly.ru",
    name: "Алексей Смирнов",
    role: "Admin",
    createdAt: new Date("2023-01-15"),
  },

  // ── Students (one cohort, used as authors + reviewers) ────────────
  {
    id: "u1",
    email: "student@peerly.ru",
    name: "Иван Петров",
    role: "Student",
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "u10",
    email: "anna.kozlova@peerly.ru",
    name: "Анна Козлова",
    role: "Student",
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "u11",
    email: "nikita.volkov@peerly.ru",
    name: "Никита Волков",
    role: "Student",
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "u12",
    email: "elena.morozova@peerly.ru",
    name: "Елена Морозова",
    role: "Student",
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "u13",
    email: "dmitry.fedorov@peerly.ru",
    name: "Дмитрий Фёдоров",
    role: "Student",
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "u14",
    email: "olga.belova@peerly.ru",
    name: "Ольга Белова",
    role: "Student",
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "u15",
    email: "pavel.romanov@peerly.ru",
    name: "Павел Романов",
    role: "Student",
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "u16",
    email: "sofia.lebedeva@peerly.ru",
    name: "София Лебедева",
    role: "Student",
    createdAt: new Date("2023-09-01"),
  },
];

export const userRepo = {
  getAll: (): Promise<DemoUser[]> => Promise.resolve(demoUsers),
  getById: (id: string): Promise<DemoUser | undefined> =>
    Promise.resolve(demoUsers.find((u) => u.id === id)),
};
