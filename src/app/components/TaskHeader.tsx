import { Calendar, Award, FileText, Clock } from 'lucide-react';

interface TaskHeaderProps {
  title: string;
  courseName: string;
  teacher: string;
  deadline: string;
  points: number;
  type: string;
  status: string;
  statusColor: string;
  extensionInfo?: {
    isExtended: boolean;
    newDeadline?: string;
  };
}

export function TaskHeader({ title, courseName, teacher, deadline, points, type, status, statusColor, extensionInfo }: TaskHeaderProps) {
  return (
    <div className="bg-[#f9f9f9] dark:bg-card rounded-[16px] p-4 desktop:p-8 mb-6 desktop:mb-8">
      <div className="flex flex-col desktop:flex-row items-start desktop:items-start desktop:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-[28px] desktop:text-[40px] font-['Work_Sans:Regular',sans-serif] tracking-[-1.8px] text-[#21214f] dark:text-foreground leading-[1.05] mb-2">
            {title}
          </h1>
          <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#4b4963] dark:text-muted-foreground">
            {courseName} • {teacher}
          </p>
        </div>
        <div className={`${statusColor} px-4 py-2 rounded-[12px] shrink-0`}>
          <span className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f] whitespace-nowrap">
            {status}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col desktop:flex-row items-start desktop:items-center gap-4 desktop:gap-6 mt-4 desktop:mt-6">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-[#4b4963] dark:text-muted-foreground" />
          <span className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#4b4963] dark:text-muted-foreground">
            Дедлайн: {deadline}
            {extensionInfo?.isExtended && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                <Clock className="w-3 h-3" />
                продлено
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="size-5 text-[#4b4963] dark:text-muted-foreground" />
          <span className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#4b4963] dark:text-muted-foreground">
            Баллы: {points}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-[#4b4963] dark:text-muted-foreground" />
          <span className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#4b4963] dark:text-muted-foreground">
            Тип: {type}
          </span>
        </div>
      </div>
    </div>
  );
}