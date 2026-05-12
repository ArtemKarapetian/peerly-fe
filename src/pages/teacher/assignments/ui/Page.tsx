import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function TeacherAssignmentsPage() {
  const { t } = useTranslation();
  const title = t("teacher.assignments.title");

  return (
    <AppShell title={title}>
      <Breadcrumbs items={[{ label: t("teacher.assignments.breadcrumb") }]} />

      <div className="mt-6">
        <div className="bg-card border border-border shadow-sm rounded-[20px] p-8 text-center max-w-[600px] mx-auto">
          <div className="w-16 h-16 bg-info-light rounded-[16px] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-[28px] font-medium text-foreground tracking-[-0.5px] mb-3">
            {title}
          </h1>
          <p className="text-[16px] text-muted-foreground leading-[1.6] mb-6">
            {t("teacher.assignments.description")}
          </p>
          <Link
            to="/teacher/assignments/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium"
          >
            {t("teacher.assignments.createAssignment")}
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
