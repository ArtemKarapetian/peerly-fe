import { Settings } from "lucide-react";

import { ROUTES } from "@/shared/config/routes.ts";

import { AdminPlaceholderPage } from "../../placeholder/ui/Page";

export default function AdminPoliciesPage() {
  return (
    <AdminPlaceholderPage
      title="Политики (Retention/Limits)"
      description="Настройка политик хранения данных и ограничений системы."
      icon={Settings}
      breadcrumbs={[{ label: "Admin", href: ROUTES.adminOverview }, { label: "Политики" }]}
    />
  );
}
