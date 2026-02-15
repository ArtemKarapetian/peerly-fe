import { useState } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { CourseHeader } from "@/app/components/CourseHeader";
import { CourseTabs } from "@/app/components/CourseTabs";
import { TaskSearch } from "@/app/components/TaskSearch";
import { TaskFilters, TaskFilter } from "@/app/components/TaskFilters";
import { TaskList, Task } from "@/app/components/TaskList";
import { ParticipantSearch } from "@/app/components/ParticipantSearch";
import { ParticipantsList, Participant } from "@/app/components/ParticipantsList";
import { LayoutDebugger } from "@/app/components/LayoutDebugger";
import { ROUTES } from "@/shared/config/routes.ts";

interface CoursePageProps {
  courseId?: string;
}

// Моковые данные заданий
const mockTasks: Task[] = [
  { id: "1", title: "Landing Page", deadline: "Дедлайн: 31 января", status: "NOT_STARTED" },
  { id: "2", title: "React компоненты", deadline: "Дедлайн: 7 февраля", status: "GRADING" },
  { id: "3", title: "Прототипирование", deadline: "Дедлайн: 14 февраля", status: "SUBMITTED" },
  { id: "4", title: "TypeScript проект", deadline: "Дедлайн: 21 февраля", status: "PEER_REVIEW" },
  { id: "5", title: "Backend API", deadline: "Дедлайн: 28 февраля", status: "TEACHER_REVIEW" },
  { id: "6", title: "Графы", deadline: "Дедлайн: 7 марта", status: "GRADED" },
];

// Моковые данные участников
const mockParticipants: Participant[] = [
  {
    id: "1",
    firstName: "Иван",
    lastName: "Иванов",
    role: "teacher",
    status: "active",
    avatarColor: "#b7bdff",
  },
  {
    id: "2",
    firstName: "Мария",
    lastName: "Петрова",
    role: "student",
    status: "active",
    avatarColor: "#b0e9fb",
  },
  {
    id: "3",
    firstName: "Алексей",
    lastName: "Сидоров",
    role: "student",
    status: "active",
    avatarColor: "#9cf38d",
  },
  {
    id: "4",
    firstName: "Елена",
    lastName: "Козлова",
    role: "student",
    status: "active",
    avatarColor: "#f2b2d6",
  },
  {
    id: "5",
    firstName: "Дмитрий",
    lastName: "Николаев",
    role: "student",
    status: "active",
    avatarColor: "#ffb8b8",
  },
  {
    id: "6",
    firstName: "Анна",
    lastName: "Михайлова",
    role: "student",
    status: "active",
    avatarColor: "#ffd4a3",
  },
  {
    id: "7",
    firstName: "Сергей",
    lastName: "Алексеев",
    role: "student",
    status: "active",
    avatarColor: "#d4b8ff",
  },
  {
    id: "8",
    firstName: "Ольга",
    lastName: "Васильева",
    role: "assistant",
    status: "active",
    avatarColor: "#b8ffd4",
  },
  {
    id: "9",
    firstName: "Павел",
    lastName: "Григорьев",
    role: "student",
    status: "active",
    avatarColor: "#ffc9e8",
  },
  {
    id: "10",
    firstName: "Татьяна",
    lastName: "Дмитриева",
    role: "student",
    status: "active",
    avatarColor: "#c9e8ff",
  },
  {
    id: "11",
    firstName: "Андрей",
    lastName: "Соколов",
    role: "student",
    status: "active",
    avatarColor: "#e8c9ff",
  },
  {
    id: "12",
    firstName: "Наталья",
    lastName: "Федорова",
    role: "student",
    status: "active",
    avatarColor: "#c9ffd4",
  },
  {
    id: "13",
    firstName: "Владимир",
    lastName: "Морозов",
    role: "student",
    status: "active",
    avatarColor: "#b7bdff",
  },
  {
    id: "14",
    firstName: "Екатерина",
    lastName: "Волкова",
    role: "student",
    status: "active",
    avatarColor: "#b0e9fb",
  },
  {
    id: "15",
    firstName: "Игорь",
    lastName: "Новиков",
    role: "student",
    status: "active",
    avatarColor: "#9cf38d",
  },
  {
    id: "16",
    firstName: "Светлана",
    lastName: "Павлова",
    role: "student",
    status: "active",
    avatarColor: "#f2b2d6",
  },
  {
    id: "17",
    firstName: "Максим",
    lastName: "Семенов",
    role: "student",
    status: "active",
    avatarColor: "#ffb8b8",
  },
  {
    id: "18",
    firstName: "Юлия",
    lastName: "Егорова",
    role: "student",
    status: "active",
    avatarColor: "#ffd4a3",
  },
  {
    id: "19",
    firstName: "Роман",
    lastName: "Кузнецов",
    role: "student",
    status: "active",
    avatarColor: "#d4b8ff",
  },
  {
    id: "20",
    firstName: "Виктория",
    lastName: "Попова",
    role: "student",
    status: "active",
    avatarColor: "#b8ffd4",
  },
  {
    id: "21",
    firstName: "Артем",
    lastName: "Лебедев",
    role: "student",
    status: "active",
    avatarColor: "#ffc9e8",
  },
  {
    id: "22",
    firstName: "Дарья",
    lastName: "Козлова",
    role: "student",
    status: "active",
    avatarColor: "#c9e8ff",
  },
  {
    id: "23",
    firstName: "Кирилл",
    lastName: "Степанов",
    role: "student",
    status: "active",
    avatarColor: "#e8c9ff",
  },
  {
    id: "24",
    firstName: "Алина",
    lastName: "Романова",
    role: "student",
    status: "inactive",
    avatarColor: "#c9ffd4",
  },
];

export default function CoursePage({ courseId = "1" }: CoursePageProps) {
  const [activeTab, setActiveTab] = useState<"assignments" | "participants">("assignments");
  const [searchQuery, setSearchQuery] = useState("");
  const [participantSearchQuery, setParticipantSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");

  // Фильтрация заданий
  const filteredTasks = mockTasks.filter((task) => {
    // Поиск
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Фильтр
    if (activeFilter === "due-soon") {
      return ["NOT_STARTED", "SUBMITTED", "PEER_REVIEW"].includes(task.status);
    }
    if (activeFilter === "completed") {
      return task.status === "GRADED";
    }

    return true;
  });

  // Фильтрация участников
  const filteredParticipants = mockParticipants.filter((participant) => {
    if (!participantSearchQuery) return true;

    const query = participantSearchQuery.toLowerCase();
    const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
    return fullName.includes(query);
  });

  const handleTaskClick = (taskId: string) => {
    // Навигация через hash
    window.location.hash = `/task/${taskId}`;
  };

  return (
    <AppShell title="Название курса">
      {/* Breadcrumbs - стандартизированная навигация */}
      <Breadcrumbs
        items={[{ label: "Курсы", href: ROUTES.courses }, { label: "Название курса" }]}
      />

      {/* Page Header - H1 после breadcrumbs */}
      <div className="mb-2">
        <CourseHeader title="Название курса" teacher="Преподаватель" />
      </div>

      {/* Tabs */}
      <CourseTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        assignmentsCount={mockTasks.length}
        participantsCount={mockParticipants.length}
      />

      {/* Course Content */}
      {activeTab === "assignments" && (
        <div className="bg-[#f9f9f9] rounded-[20px] p-5 space-y-3 mt-2">
          {/* Search */}
          <TaskSearch value={searchQuery} onChange={setSearchQuery} />

          {/* Filters */}
          <TaskFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {/* Task List */}
          <TaskList tasks={filteredTasks} onTaskClick={handleTaskClick} courseId={courseId} />
        </div>
      )}

      {activeTab === "participants" && (
        <div className="bg-[#f9f9f9] rounded-[20px] p-5 space-y-3 mt-2">
          {/* Search */}
          <ParticipantSearch value={participantSearchQuery} onChange={setParticipantSearchQuery} />

          {/* Participants List */}
          <ParticipantsList participants={filteredParticipants} />
        </div>
      )}

      {/* Layout Debugger */}
      <LayoutDebugger />
    </AppShell>
  );
}
