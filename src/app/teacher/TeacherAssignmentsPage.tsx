import { FileText } from "lucide-react";
import { TeacherPlaceholderPage } from "./TeacherPlaceholderPage";
import { ROUTES } from "@/app/routes.ts";

export default function TeacherAssignmentsPage() {
  return (
    <TeacherPlaceholderPage
      title="Конструктор заданий"
      description="Создавайте задания с настройкой параметров рецензирования."
      icon={FileText}
      breadcrumbs={[
        { label: "Дашборд преподавателя", href: ROUTES.teacherDashboard },
        { label: "Задания" },
      ]}
      primaryAction={{
        label: "Создать задание",
        href: "#/teacher/assignments/new",
      }}
    />
  );
}
