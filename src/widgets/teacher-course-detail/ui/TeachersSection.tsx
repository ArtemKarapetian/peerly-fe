import { useTranslation } from "react-i18next";

interface Teacher {
  teacherId: string | number;
  name: string;
  email?: string;
}

interface TeachersSectionProps {
  teachers: Teacher[];
}

export function TeachersSection({ teachers }: TeachersSectionProps) {
  const { t } = useTranslation();
  if (teachers.length === 0) return null;
  return (
    <section>
      <h3 className="text-13 font-medium text-muted-foreground uppercase tracking-wide mb-3">
        {t("widget.participants.teachersSection")}
      </h3>
      <ul className="space-y-1">
        {teachers.map((teacher) => (
          <TeacherRow key={String(teacher.teacherId)} teacher={teacher} />
        ))}
      </ul>
    </section>
  );
}

function TeacherRow({ teacher }: { teacher: Teacher }) {
  return (
    <li className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/30">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-warning-light text-warning text-xs font-medium shrink-0">
        {teacher.name.charAt(0)}
      </span>
      <span className="text-sm font-medium text-foreground">{teacher.name}</span>
      {teacher.email && (
        <span className="text-13 text-muted-foreground truncate">{teacher.email}</span>
      )}
    </li>
  );
}
