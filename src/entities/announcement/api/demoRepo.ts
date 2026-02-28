import { DemoAnnouncement } from "../model/types";

const demoAnnouncements: DemoAnnouncement[] = [
  { id: "an1", courseId: "c1", teacherId: "u2", title: "Изменение дедлайна", content: "Дедлайн первого задания перенесён на неделю", publishedAt: new Date("2025-01-20") },
];

export const announcementRepo = {
  getAll: (): DemoAnnouncement[] => demoAnnouncements,
};
