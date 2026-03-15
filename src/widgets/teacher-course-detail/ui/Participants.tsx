import { Search, Filter, Upload } from "lucide-react";
import { useState } from "react";

import { ParticipantImportModal } from "@/features/participant/import";

/**
 * TeacherCourseParticipants - Вкладка "Участники"
 *
 * - Список участников с поиском и фильтрами
 * - Фильтр по роли (student/teacher assistant)
 * - Фильтр по статусу (active/invited)
 * - Кнопка "Импорт" для добавления участников
 */

interface Participant {
  id: string;
  name: string;
  email: string;
  role: "student" | "assistant";
  status: "active" | "invited";
  joinedAt: Date;
}

interface TeacherCourseParticipantsProps {
  courseId: string;
}

export function TeacherCourseParticipants({ courseId }: TeacherCourseParticipantsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "assistant">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "invited">("all");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Demo participants
  const allParticipants: Participant[] = [
    {
      id: "p1",
      name: "Иван Петров",
      email: "ivan.petrov@student.ru",
      role: "student",
      status: "active",
      joinedAt: new Date("2025-01-15"),
    },
    {
      id: "p2",
      name: "Мария Сидорова",
      email: "maria.sidorova@student.ru",
      role: "student",
      status: "active",
      joinedAt: new Date("2025-01-16"),
    },
    {
      id: "p3",
      name: "Алексей Смирнов",
      email: "alex.smirnov@student.ru",
      role: "student",
      status: "active",
      joinedAt: new Date("2025-01-17"),
    },
    {
      id: "p4",
      name: "Екатерина Волкова",
      email: "kate.volkova@student.ru",
      role: "assistant",
      status: "active",
      joinedAt: new Date("2025-01-10"),
    },
    {
      id: "p5",
      name: "Дмитрий Козлов",
      email: "dmitry.kozlov@student.ru",
      role: "student",
      status: "invited",
      joinedAt: new Date("2025-01-20"),
    },
  ];

  // Apply filters
  const filteredParticipants = allParticipants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || p.role === roleFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: "student" | "assistant") => {
    if (role === "student") {
      return (
        <span className="px-2 py-1 bg-[#dbeafe] text-[#2563eb] rounded-[6px] text-[12px] font-medium">
          Студент
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-[#fff8e1] text-[#f57c00] rounded-[6px] text-[12px] font-medium">
        Ассистент
      </span>
    );
  };

  const getStatusBadge = (status: "active" | "invited") => {
    if (status === "active") {
      return (
        <span className="px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[12px] font-medium">
          Активен
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-[#fff8e1] text-[#f57c00] rounded-[6px] text-[12px] font-medium">
        Приглашён
      </span>
    );
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767692]" />
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#2563eb] transition-colors"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "all" | "student" | "assistant")}
          className="px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#2563eb] transition-colors bg-white"
        >
          <option value="all">Все роли</option>
          <option value="student">Студенты</option>
          <option value="assistant">Ассистенты</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "invited")}
          className="px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#2563eb] transition-colors bg-white"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="invited">Приглашённые</option>
        </select>

        {/* Import Button */}
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-[12px] hover:bg-[#1d4ed8] transition-colors"
        >
          <Upload className="w-4 h-4" />
          Импорт
        </button>
      </div>

      {/* Participants List */}
      <div className="space-y-0">
        {filteredParticipants.map((participant, index) => (
          <div
            key={participant.id}
            className={`p-4 hover:bg-white hover:shadow-sm hover:rounded-[12px] transition-all ${
              index !== filteredParticipants.length - 1 ? "border-b border-[#e6e8ee]" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Left: Name + Email */}
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-[15px] font-medium text-[#21214f] mb-0.5">{participant.name}</p>
                <p className="text-[14px] text-[#767692]">{participant.email}</p>
              </div>

              {/* Right: Role, Status, Date */}
              <div className="flex items-center gap-3">
                {getRoleBadge(participant.role)}
                {getStatusBadge(participant.status)}
                <p className="text-[14px] text-[#767692] w-24 text-right">
                  {participant.joinedAt.toLocaleDateString("ru-RU")}
                </p>
              </div>
            </div>
          </div>
        ))}

        {filteredParticipants.length === 0 && (
          <div className="p-12 text-center">
            <Filter className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
            <p className="text-[15px] text-[#767692]">Участники не найдены</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-6 text-[14px] text-[#767692]">
        <span>
          Всего: <strong className="text-[#21214f]">{allParticipants.length}</strong>
        </span>
        <span>
          Активных:{" "}
          <strong className="text-[#21214f]">
            {allParticipants.filter((p) => p.status === "active").length}
          </strong>
        </span>
        <span>
          Приглашённых:{" "}
          <strong className="text-[#21214f]">
            {allParticipants.filter((p) => p.status === "invited").length}
          </strong>
        </span>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <ParticipantImportModal courseId={courseId} onClose={() => setIsImportModalOpen(false)} />
      )}
    </div>
  );
}
