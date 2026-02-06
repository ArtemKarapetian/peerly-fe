import { Settings } from 'lucide-react';
import { AdminPlaceholderPage } from './AdminPlaceholderPage';

export default function AdminPoliciesPage() {
  return <AdminPlaceholderPage title="Политики (Retention/Limits)" description="Настройка политик хранения данных и ограничений системы." icon={Settings} breadcrumbs={['Admin', 'Политики']} />;
}
