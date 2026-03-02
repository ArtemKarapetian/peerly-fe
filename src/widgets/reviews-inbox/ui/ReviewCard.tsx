import { Clock, ChevronRight } from "lucide-react";

interface ReviewCardProps {
  id: string;
  courseName: string;
  taskTitle: string;
  studentName: string;
  reviewDeadline: string;
  status: string;
  isDeadlineSoon: boolean;
  onClick: () => void;
}

function getStatusInfo(status: string) {
  switch (status) {
    case "not_started":
      return { label: "Не начато", color: "bg-[#e4e4e4]", textColor: "text-[#4b4963]" };
    case "draft":
      return { label: "Черновик", color: "bg-[#ffd4a3]", textColor: "text-[#21214f]" };
    case "submitted":
      return { label: "Отправлено", color: "bg-[#9cf38d]", textColor: "text-[#21214f]" };
    default:
      return { label: "Не начато", color: "bg-[#e4e4e4]", textColor: "text-[#4b4963]" };
  }
}

function getCtaLabel(status: string) {
  switch (status) {
    case "not_started":
      return "Начать рецензию";
    case "draft":
      return "Продолжить";
    case "submitted":
      return "Посмотреть";
    default:
      return "Открыть";
  }
}

export function ReviewCard({
  courseName,
  taskTitle,
  studentName,
  reviewDeadline,
  status,
  isDeadlineSoon,
  onClick,
}: ReviewCardProps) {
  const statusInfo = getStatusInfo(status);

  return (
    <div
      onClick={onClick}
      className="bg-white border-2 border-[#e6e8ee] hover:border-[#d2def8] rounded-[16px] p-4 transition-all cursor-pointer group"
    >
      {/* Header: Course + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[#767692] mb-1">{courseName}</p>
          <h3 className="text-[16px] desktop:text-[18px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            {taskTitle}
          </h3>
        </div>

        <div
          className={`${statusInfo.color} ${statusInfo.textColor} px-3 py-1.5 rounded-[8px] shrink-0`}
        >
          <span className="text-[12px] font-medium whitespace-nowrap">{statusInfo.label}</span>
        </div>
      </div>

      {/* Student */}
      <div className="mb-3">
        <p className="text-[14px] text-[#4b4963]">
          Студент: <span className="font-medium">{studentName}</span>
        </p>
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className={`w-4 h-4 ${isDeadlineSoon ? "text-[#ff9800]" : "text-[#767692]"}`} />
        <p
          className={`text-[13px] ${isDeadlineSoon ? "text-[#ff9800] font-medium" : "text-[#767692]"}`}
        >
          Дедлайн: {reviewDeadline}
        </p>
      </div>

      {/* CTA Arrow */}
      <div className="flex items-center justify-end">
        <div className="inline-flex items-center gap-1 text-[13px] text-[#5b8def] group-hover:text-[#3d6bc6] transition-colors">
          <span>{getCtaLabel(status)}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
