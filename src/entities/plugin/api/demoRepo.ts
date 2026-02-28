import { DemoPlugin } from "../model/types";

const demoPlugins: DemoPlugin[] = [
  {
    id: "p1",
    name: "Plagiarism Checker",
    description: "Проверка на плагиат",
    version: "2.1.0",
    enabled: true,
    category: "plagiarism",
  },
  {
    id: "p2",
    name: "GitHub Integration",
    description: "Интеграция с GitHub",
    version: "1.5.3",
    enabled: true,
    category: "integration",
  },
  {
    id: "p3",
    name: "Analytics Dashboard",
    description: "Расширенная аналитика",
    version: "3.0.1",
    enabled: false,
    category: "analytics",
  },
];

export const pluginRepo = {
  getAll: (): DemoPlugin[] => demoPlugins,
};
