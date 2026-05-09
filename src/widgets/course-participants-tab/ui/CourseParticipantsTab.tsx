import { useState } from "react";
import { useTranslation } from "react-i18next";

import { coverColorFor } from "@/shared/lib/coverColor";

import { useCourseParticipants } from "@/entities/course";
import { ParticipantsList } from "@/entities/user";
import type { Participant } from "@/entities/user";

import { ParticipantSearch } from "@/features/participant/search";

interface CourseParticipantsTabProps {
  courseId: string;
}

function splitName(userName: string): { firstName: string; lastName: string } {
  const trimmed = userName.trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

export function CourseParticipantsTab({ courseId }: CourseParticipantsTabProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useCourseParticipants(courseId);

  const participants: Participant[] = [
    ...(data?.teachers ?? []).map((u) => {
      const { firstName, lastName } = splitName(u.userName);
      return {
        id: String(u.id),
        firstName,
        lastName,
        role: "teacher" as const,
        status: "active" as const,
        avatarColor: coverColorFor(String(u.id)),
      };
    }),
    ...(data?.students ?? []).map((u) => {
      const { firstName, lastName } = splitName(u.userName);
      return {
        id: String(u.id),
        firstName,
        lastName,
        role: "student" as const,
        status: "active" as const,
        avatarColor: coverColorFor(String(u.id)),
      };
    }),
  ];

  const filtered = participants.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return `${p.firstName} ${p.lastName}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-3">
      <ParticipantSearch value={searchQuery} onChange={setSearchQuery} />
      {isLoading ? (
        <p className="text-[14px] text-text-tertiary px-1">{t("common.loading")}</p>
      ) : (
        <ParticipantsList participants={filtered} />
      )}
    </div>
  );
}
