export interface StudentCourse {
  id: string;
  title: string;
  teacher: string;
  coverColor: string;
  status?: "active" | "completed";
}

export const mockCourses: StudentCourse[] = [
  {
    id: "2",
    title: "Введение в программирование",
    teacher: "Иванов И.И.",
    coverColor: "#b0e9fb",
    status: "active",
  },
  {
    id: "3",
    title: "Веб-разработка",
    teacher: "Петров П.П.",
    coverColor: "#b7bdff",
    status: "active",
  },
  {
    id: "4",
    title: "Дизайн интерфейсов",
    teacher: "Сидорова С.С.",
    coverColor: "#9cf38d",
    status: "completed",
  },
  {
    id: "5",
    title: "Мобильная разработка",
    teacher: "Козлов К.К.",
    coverColor: "#ffb8b8",
    status: "active",
  },
  {
    id: "6",
    title: "Алгоритмы и структуры данных",
    teacher: "Алексеев А.А.",
    coverColor: "#ffd4a3",
    status: "active",
  },
  {
    id: "7",
    title: "Базы данных",
    teacher: "Михайлов М.М.",
    coverColor: "#d4b8ff",
    status: "completed",
  },
  {
    id: "8",
    title: "Машинное обучение",
    teacher: "Николаева Н.Н.",
    coverColor: "#b8ffd4",
    status: "active",
  },
  {
    id: "9",
    title: "Компьютерные сети",
    teacher: "Сергеев С.С.",
    coverColor: "#ffc9e8",
    status: "active",
  },
  {
    id: "10",
    title: "Операционные системы",
    teacher: "Васильева В.В.",
    coverColor: "#c9e8ff",
    status: "completed",
  },
  {
    id: "11",
    title: "Тестирование ПО",
    teacher: "Григорьев Г.Г.",
    coverColor: "#e8c9ff",
    status: "active",
  },
  {
    id: "12",
    title: "Архитектура ПО",
    teacher: "Дмитриев Д.Д.",
    coverColor: "#b7bdff",
    status: "active",
  },
  {
    id: "13",
    title: "Параллельное программирование",
    teacher: "Федорова Ф.Ф.",
    coverColor: "#9cf38d",
    status: "completed",
  },
  {
    id: "14",
    title: "Информационная безопасность",
    teacher: "Егоров Е.Е.",
    coverColor: "#ffb8b8",
    status: "active",
  },
  {
    id: "15",
    title: "Компьютерная графика",
    teacher: "Романова Р.Р.",
    coverColor: "#ffd4a3",
    status: "active",
  },
];
