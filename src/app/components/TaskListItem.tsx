import { TaskStatus } from './StatusCard';

/**
 * TaskListItem - Строка задания в списке
 */

interface TaskListItemProps {
  title: string;
  deadline: string;
  status: TaskStatus;
  onClick?: () => void;
}

export function TaskListItem({ title, deadline, status, onClick }: TaskListItemProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'NOT_STARTED':
        return { label: 'Не начато', color: 'bg-[#e4e4e4]', textColor: 'text-[#4b4963]' };
      case 'SUBMITTED':
        return { label: 'Сдано', color: 'bg-[#b7bdff]', textColor: 'text-[#21214f]' };
      case 'PEER_REVIEW':
        return { label: 'На проверке', color: 'bg-[#b0e9fb]', textColor: 'text-[#21214f]' };
      case 'TEACHER_REVIEW':
        return { label: 'Нужно проверить', color: 'bg-[#ffd4a3]', textColor: 'text-[#21214f]' };
      case 'GRADING':
        return { label: 'Черновик', color: 'bg-[#e6e8ee]', textColor: 'text-[#4b4963]' };
      case 'GRADED':
        return { label: 'Оценено', color: 'bg-[#9cf38d]', textColor: 'text-[#21214f]' };
      case 'OVERDUE':
        return { label: 'Просрочено', color: 'bg-[#ffb8b8]', textColor: 'text-[#21214f]' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center gap-4 px-5 py-4
        text-left
        transition-all
        hover:bg-white hover:shadow-sm hover:rounded-[12px]
        group
      "
    >
      {/* Left: Title and Deadline */}
      <div className="flex-1 min-w-[100px] space-y-1">
        <p className="text-[18px] leading-[1.05] tracking-[-0.81px] text-[#21214f]">
          {title}
        </p>
        <p className="text-[16px] leading-[1.1] tracking-[-0.72px] text-[#4b4963]">
          {deadline}
        </p>
      </div>

      {/* Right: Status Pill */}
      <div className="flex items-center gap-2 shrink-0">
        <div className={`${statusInfo.color} ${statusInfo.textColor} px-2 py-2 rounded-[12px]`}>
          <span className="text-[16px] leading-[1.1] tracking-[-0.72px]">
            {statusInfo.label}
          </span>
        </div>
      </div>
    </button>
  );
}