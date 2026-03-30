import { Database, Users, TrendingUp, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/shared/ui/PageHeader";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminOrgsPage - Управление организациями
 */

interface Organization {
  id: string;
  name: string;
  plan: "Free" | "Pro" | "Enterprise";
  usersCount: number;
  coursesCount: number;
  status: "active" | "suspended";
}

const mockOrgs: Organization[] = [
  {
    id: "1",
    name: "Университет ИТМО",
    plan: "Enterprise",
    usersCount: 2450,
    coursesCount: 89,
    status: "active",
  },
  {
    id: "2",
    name: "ВШЭ",
    plan: "Enterprise",
    usersCount: 3200,
    coursesCount: 124,
    status: "active",
  },
  {
    id: "3",
    name: "МГУ",
    plan: "Enterprise",
    usersCount: 4100,
    coursesCount: 156,
    status: "active",
  },
  { id: "4", name: "СПбГУ", plan: "Pro", usersCount: 1800, coursesCount: 67, status: "active" },
  {
    id: "5",
    name: "МФТИ",
    plan: "Enterprise",
    usersCount: 2200,
    coursesCount: 92,
    status: "active",
  },
  {
    id: "6",
    name: "Яндекс Практикум",
    plan: "Pro",
    usersCount: 890,
    coursesCount: 34,
    status: "active",
  },
  { id: "7", name: "Нетология", plan: "Pro", usersCount: 1200, coursesCount: 45, status: "active" },
  {
    id: "8",
    name: "GeekBrains",
    plan: "Free",
    usersCount: 340,
    coursesCount: 12,
    status: "active",
  },
];

export default function AdminOrgsPage() {
  const { t } = useTranslation();
  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(mockOrgs, 10);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-success-light text-success";
      case "Pro":
        return "bg-info-light text-brand-primary";
      case "Free":
        return "bg-muted text-[--text-secondary]";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AppShell title={t("admin.orgs.title")}>
      <PageHeader title={t("admin.orgs.title")} subtitle={t("admin.orgs.subtitle")} />

      <div>
        {/* Stats */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4 mb-6">
          <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-md)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info-light rounded-[var(--radius-md)] flex items-center justify-center">
                <Database className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-xs text-[--text-secondary]">{t("admin.orgsPage.totalOrgs")}</p>
                <p className="text-xl font-semibold text-[--text-primary]">{mockOrgs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-md)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-light rounded-[var(--radius-md)] flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-[--text-secondary]">{t("admin.orgsPage.totalUsers")}</p>
                <p className="text-xl font-semibold text-[--text-primary]">
                  {mockOrgs.reduce((sum, org) => sum + org.usersCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-md)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-light rounded-[var(--radius-md)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-[--text-secondary]">
                  {t("admin.orgsPage.totalCourses")}
                </p>
                <p className="text-xl font-semibold text-[--text-primary]">
                  {mockOrgs.reduce((sum, org) => sum + org.coursesCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-lg)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[--surface-border] bg-[--surface-hover]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                    {t("admin.orgsPage.headerOrg")}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                    {t("admin.orgsPage.headerPlan")}
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                    {t("admin.orgsPage.headerUsers")}
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                    {t("admin.orgsPage.headerCourses")}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                    {t("admin.orgsPage.headerStatus")}
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                    {t("admin.orgsPage.headerActions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((org, index) => (
                  <tr
                    key={org.id}
                    className={`border-b border-[--surface-border] last:border-0 hover:bg-[--surface-hover] transition-colors ${
                      index % 2 === 0 ? "" : "bg-[--surface-hover]/50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[--text-primary]">{org.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${getPlanColor(org.plan)}`}
                      >
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-[--text-primary] font-medium">
                        {org.usersCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-[--text-primary] font-medium">
                        {org.coursesCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 bg-success-light text-success rounded-md text-xs font-medium">
                        {t("admin.orgsPage.statusActive")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() =>
                            alert(t("admin.orgsPage.openOrgAlert", { name: org.name }))
                          }
                          className="p-2 hover:bg-[--surface-hover] rounded-[var(--radius-sm)] transition-colors"
                          title={t("admin.orgsPage.detailsTooltip")}
                        >
                          <ExternalLink className="w-4 h-4 text-[--text-secondary]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
