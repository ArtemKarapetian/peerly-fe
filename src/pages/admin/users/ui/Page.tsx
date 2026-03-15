import { Users, Search, X, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

import { useAsync } from "@/shared/lib/useAsync";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

import { organizationRepo } from "@/entities/organization";
import { userRepo } from "@/entities/user";
import { DemoUser } from "@/entities/user/model/types.ts";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminUsersPage - Управление пользователями и ролями
 *
 * Функции:
 * - Поиск по имени/логину
 * - Фильтры: роль (student/teacher/admin), статус (active/disabled)
 * - Детальный просмотр пользователя с ролями, org, last login, сессиями
 * - Действия: изменить роль, отключить/включить, сброс пароля
 * - Логирование всех изменений в Admin Audit Log
 */

interface UserWithStatus extends DemoUser {
  status: "active" | "disabled";
  lastLogin?: Date;
  sessions?: UserSession[];
}

interface UserSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setSelectedUser] = useState<UserWithStatus | null>(null);

  const { data: users, isLoading, error, refetch } = useAsync(() => userRepo.getAll(), []);

  const usersWithStatus: UserWithStatus[] = (users ?? []).map((user) => ({
    ...user,
    status: "active" as const,
    lastLogin: new Date(),
  }));

  const filteredUsers = usersWithStatus.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    filteredUsers,
    10,
  );

  if (isLoading)
    return (
      <AppShell title="Пользователи">
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title="Пользователи">
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-[#f3e5f5] text-[#7b1fa2]";
      case "Teacher":
        return "bg-[#e3f2fd] text-[#1976d2]";
      case "Student":
        return "bg-[#e8f5e9] text-[#388e3c]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
          <CheckCircle className="w-3 h-3" />
          Активен
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f5f5f5] text-[#767692] rounded-[6px] text-[11px] font-medium">
          <XCircle className="w-3 h-3" />
          Неактивен
        </span>
      );
    }
  };

  return (
    <AppShell title="Пользователи">
      <PageHeader title="Пользователи" subtitle="Управление пользователями системы" />

      <div>
        {/* Search and Filters */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Поиск
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#767692]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Имя или email..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Active filters */}
          {searchQuery && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-[#e6e8ee]">
              <span className="text-[13px] text-[#767692]">Фильтры:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f9f9f9] text-[#21214f] rounded-[6px] text-[12px]">
                  Поиск: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-[#d4183d]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#e6e8ee] bg-[#fafbfc]">
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Пользователь
                  </th>
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Роль
                  </th>
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Организация
                  </th>
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Последний вход
                  </th>
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Статус
                  </th>
                  <th className="text-right px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => {
                  const org = organizationRepo.getAll().find((o) => o.id === user.orgId);
                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-[#e6e8ee] last:border-0 hover:bg-[#fafbfc] transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[15px] font-medium text-[#21214f]">{user.name}</p>
                          <p className="text-[13px] text-[#767692]">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-[6px] text-[11px] font-medium ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[14px] text-[#21214f]">{org?.name || "Unknown"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[14px] text-[#767692]">
                          {user.lastLogin?.toLocaleString("ru-RU")}
                        </p>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-[#5b8def] text-white rounded-[8px] hover:bg-[#4a7de8] transition-colors text-[13px]"
                        >
                          Управление
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-[#21214f] mb-2">
                Пользователи не найдены
              </h3>
              <p className="text-[14px] text-[#767692]">
                Попробуйте изменить параметры поиска или фильтры
              </p>
            </div>
          )}
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
