import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function TeacherExtensionsPage() {
  const { t } = useTranslation();
  const extensions = [
    {
      id: "1",
      student: t("teacher.extensions.studentIvan"),
      course: "Web Dev",
      assignment: "Final Project",
      requested: "2026-01-20",
      newDeadline: "2026-01-27",
      reason: t("teacher.extensions.reasonIllness"),
      status: "pending",
    },
    {
      id: "2",
      student: t("teacher.extensions.studentMaria"),
      course: "Algorithms",
      assignment: "Sorting",
      requested: "2026-01-18",
      newDeadline: "2026-01-25",
      reason: t("teacher.extensions.reasonFamily"),
      status: "approved",
    },
    {
      id: "3",
      student: t("teacher.extensions.studentAlexey"),
      course: "Data Structures",
      assignment: "Trees",
      requested: "2026-01-15",
      newDeadline: "2026-01-22",
      reason: t("teacher.extensions.reasonTechnical"),
      status: "rejected",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-warning-light text-warning rounded-[8px] text-[12px] font-medium">
            <Clock className="w-4 h-4" />
            {t("teacher.extensions.pending")}
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-success-light text-success rounded-[8px] text-[12px] font-medium">
            <CheckCircle className="w-4 h-4" />
            {t("teacher.extensions.approved")}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-error-light text-error rounded-[8px] text-[12px] font-medium">
            <XCircle className="w-4 h-4" />
            {t("teacher.extensions.rejected")}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell title={t("teacher.extensions.title")}>
      <Breadcrumbs items={[{ label: t("teacher.extensions.breadcrumb") }]} />

      <PageHeader
        title={t("teacher.extensions.title")}
        subtitle={t("teacher.extensions.subtitle")}
      />

      <div>
        <div className="space-y-4">
          {extensions.map((ext) => (
            <div key={ext.id} className="bg-card border-2 border-border rounded-[20px] p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[16px] font-medium text-foreground">{ext.student}</h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    {ext.course} • {ext.assignment}
                  </p>
                </div>
                {getStatusBadge(ext.status)}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 text-[13px]">
                <div>
                  <span className="text-muted-foreground">
                    {t("teacher.extensions.requested")}{" "}
                  </span>
                  <span className="text-foreground font-medium">
                    {new Date(ext.requested).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {t("teacher.extensions.newDeadline")}{" "}
                  </span>
                  <span className="text-foreground font-medium">
                    {new Date(ext.newDeadline).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {t("teacher.extensions.reasonLabel")}{" "}
                  </span>
                  <span className="text-foreground font-medium">{ext.reason}</span>
                </div>
              </div>
              {ext.status === "pending" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <button className="px-3 py-1.5 bg-success text-primary-foreground rounded-[8px] hover:bg-success text-[13px] font-medium transition-colors">
                    {t("teacher.extensions.approve")}
                  </button>
                  <button className="px-3 py-1.5 bg-destructive text-primary-foreground rounded-[8px] hover:bg-destructive text-[13px] font-medium transition-colors">
                    {t("teacher.extensions.reject")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
