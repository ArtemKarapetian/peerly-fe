import { MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * ParticipantsList - Список участников курса
 */

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  role: "student" | "teacher" | "assistant";
  status: "active" | "inactive";
  avatarColor?: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  onParticipantClick?: (id: string) => void;
}

export function ParticipantsList({ participants, onParticipantClick }: ParticipantsListProps) {
  const { t } = useTranslation();

  const getRoleLabel = (role: Participant["role"]) => {
    switch (role) {
      case "student":
        return t("entity.user.roleStudent");
      case "teacher":
        return t("entity.user.roleTeacher");
      case "assistant":
        return t("entity.user.roleAssistant");
    }
  };

  const getRoleBadgeColor = (role: Participant["role"]) => {
    switch (role) {
      case "teacher":
        return "bg-[#3d6bc6] text-white";
      case "assistant":
        return "bg-[#f57c00] text-white";
      case "student":
      default:
        return "bg-[#e6e8ee] text-[#21214f]";
    }
  };
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-[14px] text-[#767692]">{t("entity.user.participantsNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {participants.map((participant, index) => (
        <div key={participant.id}>
          <button
            onClick={() => onParticipantClick?.(participant.id)}
            className="
              w-full flex items-center gap-4 px-5 py-4
              text-left
              transition-all
              hover:bg-white hover:shadow-sm hover:rounded-[12px]
              group
            "
          >
            {/* Avatar */}
            <div
              className="
                w-10 h-10 rounded-full
                flex items-center justify-center
                text-[14px] font-semibold text-white
                shrink-0
              "
              style={{ backgroundColor: participant.avatarColor || "#b7bdff" }}
            >
              {getInitials(participant.firstName, participant.lastName)}
            </div>

            {/* Name and Role */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] leading-[1.3] tracking-[-0.3px] text-[#21214f] font-semibold truncate">
                  {participant.firstName} {participant.lastName}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-[6px] text-[11px] font-medium ${getRoleBadgeColor(participant.role)}`}
                >
                  {getRoleLabel(participant.role)}
                </span>
              </div>
              {participant.status === "inactive" && (
                <p className="text-[13px] leading-[1.4] text-[#c7c7c7]">
                  {t("entity.user.inactive")}
                </p>
              )}
            </div>

            {/* Menu Icon */}
            <div className="shrink-0">
              <MoreVertical className="w-4 h-4 text-[#c7c7c7] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* Divider - не показываем после последнего элемента */}
          {index < participants.length - 1 && <div className="border-b border-[#e6e8ee]" />}
        </div>
      ))}
    </div>
  );
}
