export interface StudentCourse {
  id: string;
  title: string;
  teacher: string;
  coverColor: string;
  status?: "active" | "completed";
  deadline?: string; // ISO date string for nearest deadline
  progress?: number; // 0-100
  newAssignments?: number;
}

export const mockCourses: StudentCourse[] = [
  {
    id: "2",
    title: "Введение в программирование",
    teacher: "Иванов И.И.",
    coverColor: "#b0e9fb",
    status: "active",
    deadline: "2026-03-18",
    progress: 60,
    newAssignments: 2,
  },
  {
    id: "3",
    title: "Веб-разработка",
    teacher: "Петров П.П.",
    coverColor: "#b7bdff",
    status: "active",
    deadline: "2026-03-25",
    progress: 35,
    newAssignments: 1,
  },
  {
    id: "4",
    title: "Дизайн интерфейсов",
    teacher: "Сидорова С.С.",
    coverColor: "#9cf38d",
    status: "completed",
    progress: 100,
  },
  {
    id: "5",
    title: "Мобильная разработка",
    teacher: "Козлов К.К.",
    coverColor: "#ffb8b8",
    status: "active",
    deadline: "2026-03-16",
    progress: 20,
  },
  {
    id: "6",
    title: "Алгоритмы и структуры данных",
    teacher: "Алексеев А.А.",
    coverColor: "#ffd4a3",
    status: "active",
    deadline: "2026-04-01",
    progress: 75,
    newAssignments: 3,
  },
  {
    id: "7",
    title: "Базы данных",
    teacher: "Михайлов М.М.",
    coverColor: "#d4b8ff",
    status: "completed",
    progress: 100,
  },
  {
    id: "8",
    title: "Машинное обучение",
    teacher: "Николаева Н.Н.",
    coverColor: "#b8ffd4",
    status: "active",
    deadline: "2026-03-30",
    progress: 45,
    newAssignments: 1,
  },
  {
    id: "9",
    title: "Компьютерные сети",
    teacher: "Сергеев С.С.",
    coverColor: "#ffc9e8",
    status: "active",
    progress: 10,
  },
  {
    id: "10",
    title: "Операционные системы",
    teacher: "Васильева В.В.",
    coverColor: "#c9e8ff",
    status: "completed",
    progress: 100,
  },
  {
    id: "11",
    title: "Тестирование ПО",
    teacher: "Григорьев Г.Г.",
    coverColor: "#e8c9ff",
    status: "active",
    deadline: "2026-04-10",
    progress: 55,
  },
  {
    id: "12",
    title: "Архитектура ПО",
    teacher: "Дмитриев Д.Д.",
    coverColor: "#b7bdff",
    status: "active",
    deadline: "2026-03-22",
    progress: 30,
    newAssignments: 2,
  },
  {
    id: "13",
    title: "Параллельное программирование",
    teacher: "Федорова Ф.Ф.",
    coverColor: "#9cf38d",
    status: "completed",
    progress: 100,
  },
  {
    id: "14",
    title: "Информационная безопасность",
    teacher: "Егоров Е.Е.",
    coverColor: "#ffb8b8",
    status: "active",
    deadline: "2026-03-19",
    progress: 50,
    newAssignments: 1,
  },
  {
    id: "15",
    title: "Компьютерная графика",
    teacher: "Романова Р.Р.",
    coverColor: "#ffd4a3",
    status: "active",
    progress: 15,
  },
];
