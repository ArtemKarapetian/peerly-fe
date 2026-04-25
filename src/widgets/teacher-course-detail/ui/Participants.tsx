import { Search, Filter, Upload } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ParticipantImportModal } from "@/features/participant/import";

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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "assistant">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "invited">("all");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Demo participants
  const allParticipants: Participant[] = [
    {
      id: "p1",
      name: t("widget.participants.nameIvan"),
      email: "ivan.petrov@student.ru",
      role: "student",
      status: "active",
      joinedAt: new Date("2025-01-15"),
    },
    {
      id: "p2",
      name: t("widget.participants.nameMaria"),
      email: "maria.sidorova@student.ru",
      role: "student",
      status: "active",
      joinedAt: new Date("2025-01-16"),
    },
    {
      id: "p3",
      name: t("widget.participants.nameAlexey"),
      email: "alex.smirnov@student.ru",
      role: "student",
      status: "active",
      joinedAt: new Date("2025-01-17"),
    },
    {
      id: "p4",
      name: t("widget.participants.nameEkaterina"),
      email: "kate.volkova@student.ru",
      role: "assistant",
      status: "active",
      joinedAt: new Date("2025-01-10"),
    },
    {
      id: "p5",
      name: t("widget.participants.nameDmitry"),
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
        <span className="px-2 py-1 bg-info-light text-info rounded-[6px] text-[12px] font-medium">
          {t("widget.participants.roleBadgeStudent")}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[12px] font-medium">
        {t("widget.participants.roleBadgeAssistant")}
      </span>
    );
  };

  const getStatusBadge = (status: "active" | "invited") => {
    if (status === "active") {
      return (
        <span className="px-2 py-1 bg-success-light text-success rounded-[6px] text-[12px] font-medium">
          {t("widget.participants.statusActive")}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[12px] font-medium">
        {t("widget.participants.statusInvited")}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("widget.participants.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "all" | "student" | "assistant")}
          className="px-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors bg-card"
        >
          <option value="all">{t("widget.participants.allRoles")}</option>
          <option value="student">{t("widget.participants.studentsRole")}</option>
          <option value="assistant">{t("widget.participants.assistantsRole")}</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "invited")}
          className="px-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors bg-card"
        >
          <option value="all">{t("widget.participants.allStatuses")}</option>
          <option value="active">{t("widget.participants.activeStatus")}</option>
          <option value="invited">{t("widget.participants.invitedStatus")}</option>
        </select>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-inverse rounded-[12px] hover:bg-brand-primary-hover transition-colors"
        >
          <Upload className="w-4 h-4" />
          {t("widget.participants.import")}
        </button>
      </div>

      <div className="space-y-0">
        {filteredParticipants.map((participant, index) => (
          <div
            key={participant.id}
            className={`p-4 hover:bg-card hover:shadow-sm hover:rounded-[12px] transition-all ${
              index !== filteredParticipants.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-[15px] font-medium text-foreground mb-0.5">{participant.name}</p>
                <p className="text-[14px] text-muted-foreground">{participant.email}</p>
              </div>

              <div className="flex items-center gap-3">
                {getRoleBadge(participant.role)}
                {getStatusBadge(participant.status)}
                <p className="text-[14px] text-muted-foreground w-24 text-right">
                  {participant.joinedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {filteredParticipants.length === 0 && (
          <div className="p-12 text-center">
            <Filter className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-[15px] text-muted-foreground">{t("widget.participants.notFound")}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-6 text-[14px] text-muted-foreground">
        <span>
          {t("widget.participants.total")}{" "}
          <strong className="text-foreground">{allParticipants.length}</strong>
        </span>
        <span>
          {t("widget.participants.activeCount")}{" "}
          <strong className="text-foreground">
            {allParticipants.filter((p) => p.status === "active").length}
          </strong>
        </span>
        <span>
          {t("widget.participants.invitedCount")}{" "}
          <strong className="text-foreground">
            {allParticipants.filter((p) => p.status === "invited").length}
          </strong>
        </span>
      </div>

      {isImportModalOpen && (
        <ParticipantImportModal courseId={courseId} onClose={() => setIsImportModalOpen(false)} />
      )}
    </div>
  );
}
