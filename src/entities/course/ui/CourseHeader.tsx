/**
 * CourseHeader - Заголовок курса с обложкой, названием и преподавателем
 */

interface CourseHeaderProps {
  title: string;
  teacher: string;
  coverColor?: string;
}

export function CourseHeader({ title, teacher, coverColor = "#f2b2d6" }: CourseHeaderProps) {
  const initial = teacher.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
      {/* Cover */}
      <div className="w-full h-[100px]" style={{ backgroundColor: coverColor }} />

      {/* Text Content */}
      <div className="px-6 pb-6 pt-4 space-y-2">
        <h1 className="text-[32px] font-medium leading-[1.05] tracking-[-0.5px] text-foreground">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-primary-lighter text-brand-primary flex items-center justify-center text-[12px] font-semibold">
            {initial}
          </div>
          <span className="text-[15px] text-muted-foreground">{teacher}</span>
        </div>
      </div>
    </div>
  );
}
