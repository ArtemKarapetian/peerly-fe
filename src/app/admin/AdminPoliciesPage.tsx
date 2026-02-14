import {Settings} from 'lucide-react';
import {AdminPlaceholderPage} from './AdminPlaceholderPage';
import {ROUTES} from "@/app/routes";

export default function AdminPoliciesPage() {
    return <AdminPlaceholderPage title="Политики (Retention/Limits)"
                                 description="Настройка политик хранения данных и ограничений системы." icon={Settings}
                                 breadcrumbs={[
                                     {label: 'Admin', href: ROUTES.adminOverview},
                                     {label: 'Политики'}
                                 ]}
    />;
}
