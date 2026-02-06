import { FileText } from 'lucide-react';
import { TeacherPlaceholderPage } from './TeacherPlaceholderPage';

export default function TeacherAssignmentsPage() {
  return (
    <TeacherPlaceholderPage
      title="Конструктор заданий"
      description="Создавайте задания с настройкой параметров рецензирования."
      icon={FileText}
      breadcrumbs={['Дашборд преподавателя', 'Задания']}
      primaryAction={{
        label: 'Создать задание',
        href: '#/teacher/assignments/new',
      }}
    />
  );
}