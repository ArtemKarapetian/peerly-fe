import { useTranslation } from "react-i18next";

import { Card, Field, Select } from "@/shared/ui";

interface CourseOption {
  id: string;
  title: string;
}

interface CourseSelectorCardProps {
  courses: CourseOption[];
  value: string;
  onChange: (id: string) => void;
}

export function CourseSelectorCard({ courses, value, onChange }: CourseSelectorCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-6">
      <Field label={t("teacher.analytics.courseLabel")}>
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>
      </Field>
    </Card>
  );
}
