import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Database, Users, TrendingUp, ExternalLink } from "lucide-react";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

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
  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(mockOrgs, 10);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-[#e8f5e9] text-[#388e3c]";
      case "Pro":
        return "bg-[#e3f2fd] text-[#1976d2]";
      case "Free":
        return "bg-[#f5f5f5] text-[--text-secondary]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <AppShell title="Организации">
      <div className="mb-6">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Организации
        </h1>
        <p className="text-[--text-secondary]">Управление организациями в системе</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4 mb-6">
        <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-md)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e3f2fd] rounded-[var(--radius-md)] flex items-center justify-center">
              <Database className="w-5 h-5 text-[#1976d2]" />
            </div>
            <div>
              <p className="text-xs text-[--text-secondary]">Всего организаций</p>
              <p className="text-xl font-semibold text-[--text-primary]">{mockOrgs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-md)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e8f5e9] rounded-[var(--radius-md)] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#388e3c]" />
            </div>
            <div>
              <p className="text-xs text-[--text-secondary]">Всего пользователей</p>
              <p className="text-xl font-semibold text-[--text-primary]">
                {mockOrgs.reduce((sum, org) => sum + org.usersCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-md)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fff8e1] rounded-[var(--radius-md)] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#f57c00]" />
            </div>
            <div>
              <p className="text-xs text-[--text-secondary]">Всего курсов</p>
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
                  Организация
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  План
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Пользователей
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Курсов
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Статус
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Действия
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
                    <span className="inline-flex px-2.5 py-1 bg-[#e8f5e9] text-[#388e3c] rounded-md text-xs font-medium">
                      Активна
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => alert(`Открыть организацию: ${org.name}`)}
                        className="p-2 hover:bg-[--surface-hover] rounded-[var(--radius-sm)] transition-colors"
                        title="Подробнее"
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
    </AppShell>
  );
}
