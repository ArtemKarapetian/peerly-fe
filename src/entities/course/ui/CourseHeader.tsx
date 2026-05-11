import type { CourseTeacher } from "../model/types";

interface CourseHeaderProps {
  title: string;
  coverColor?: string;
  description?: string;
  teachers?: CourseTeacher[];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function CourseHeader({
  title,
  coverColor = "#f2b2d6",
  description,
  teachers,
}: CourseHeaderProps) {
  return (
    <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
      <div className="w-full h-[100px]" style={{ backgroundColor: coverColor }} />

      <div className="px-6 pb-6 pt-4 space-y-3">
        <h1 className="text-[32px] font-medium leading-[1.05] tracking-[-0.5px] text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-[15px] text-muted-foreground leading-[1.5]">{description}</p>
        ) : null}
        {teachers && teachers.length > 0 ? (
          <ul className="flex flex-wrap gap-2 pt-1">
            {teachers.map((t) => (
              <li
                key={t.id}
                className="inline-flex items-center gap-2 bg-muted rounded-full pl-1 pr-3 py-1"
                title={t.email}
              >
                <span
                  className="inline-flex items-center justify-center size-7 rounded-full text-[11px] font-semibold text-foreground"
                  style={{ backgroundColor: coverColor }}
                >
                  {getInitials(t.name)}
                </span>
                <span className="text-[13px] text-foreground">{t.name}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
