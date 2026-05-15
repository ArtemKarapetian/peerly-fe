import { useTranslation } from "react-i18next";

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  role: "student" | "teacher" | "assistant";
  avatarColor?: string;
}

interface ParticipantsListProps {
  participants: Participant[];
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
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
        return "bg-brand-primary text-text-inverse";
      case "assistant":
        return "bg-warning text-text-inverse";
      case "student":
      default:
        return "bg-muted text-foreground";
    }
  };
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-[14px] text-text-tertiary">{t("entity.user.participantsNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {participants.map((participant, index) => (
        <div key={participant.id}>
          <div
            className="
              w-full flex items-center gap-4 px-5 py-4
              text-left
            "
          >
            <div
              className="
                w-10 h-10 rounded-full
                flex items-center justify-center
                text-[14px] font-semibold text-text-inverse
                shrink-0
              "
              style={{ backgroundColor: participant.avatarColor || "var(--brand-primary-lighter)" }}
            >
              {getInitials(participant.firstName, participant.lastName)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] leading-[1.3] tracking-[-0.3px] text-text-primary font-semibold truncate">
                  {participant.firstName} {participant.lastName}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-[6px] text-[11px] font-medium ${getRoleBadgeColor(participant.role)}`}
                >
                  {getRoleLabel(participant.role)}
                </span>
              </div>
            </div>
          </div>

          {index < participants.length - 1 && <div className="border-b border-border" />}
        </div>
      ))}
    </div>
  );
}
