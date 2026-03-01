import { Settings } from "lucide-react";

import { CRUMBS } from "@/shared/config/breadcrumbs.ts";

import { AdminPlaceholderPage } from "../../placeholder/ui/Page";

export default function AdminPoliciesPage() {
  return (
    <AdminPlaceholderPage
      title="Политики (Retention/Limits)"
      description="Настройка политик хранения данных и ограничений системы."
      icon={Settings}
      breadcrumbs={[CRUMBS.adminRoot, { label: "Политики" }]}
    />
  );
}
