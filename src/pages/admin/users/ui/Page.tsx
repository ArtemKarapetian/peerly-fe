import { Users, Search, X, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

import { userRepo } from "@/entities/user";
import { DemoUser } from "@/entities/user/model/types.ts";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setSelectedUser] = useState<UserWithStatus | null>(null);

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useAsync(() => userRepo.getAll(), [], {
    onError: "redirect",
  });

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
      <AppShell title={t("admin.users.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("admin.users.title")}>
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-accent text-brand-primary";
      case "Teacher":
        return "bg-info-light text-brand-primary";
      case "Student":
        return "bg-success-light text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[11px] font-medium">
          <CheckCircle className="w-3 h-3" />
          {t("admin.usersPage.statusActive")}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-[6px] text-[11px] font-medium">
          <XCircle className="w-3 h-3" />
          {t("admin.usersPage.statusInactive")}
        </span>
      );
    }
  };

  return (
    <AppShell title={t("admin.users.title")}>
      <PageHeader title={t("admin.users.title")} subtitle={t("admin.users.subtitle")} />

      <div>
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("admin.usersPage.searchLabel")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("admin.usersPage.searchPlaceholder")}
                  className="w-full pl-11 pr-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-border">
              <span className="text-[13px] text-muted-foreground">
                {t("admin.usersPage.filtersLabel")}
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground rounded-[6px] text-[12px]">
                  {t("admin.usersPage.searchFilter", { query: searchQuery })}
                  <button onClick={() => setSearchQuery("")} className="hover:text-error">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-surface-hover">
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                    {t("admin.usersPage.headerUser")}
                  </th>
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                    {t("admin.usersPage.headerRole")}
                  </th>
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                    {t("admin.usersPage.headerLastLogin")}
                  </th>
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                    {t("admin.usersPage.headerStatus")}
                  </th>
                  <th className="text-right px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                    {t("admin.usersPage.headerActions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => {
                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-border last:border-0 hover:bg-surface-hover transition-colors ${
                        index % 2 === 0 ? "bg-card" : "bg-muted"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[15px] font-medium text-foreground">{user.name}</p>
                          <p className="text-[13px] text-muted-foreground">{user.email}</p>
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
                        <p className="text-[14px] text-muted-foreground">
                          {user.lastLogin?.toLocaleString("ru-RU")}
                        </p>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-brand-primary text-primary-foreground rounded-[8px] hover:bg-brand-primary-hover transition-colors text-[13px]"
                        >
                          {t("admin.usersPage.manage")}
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
              <Users className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                {t("admin.usersPage.notFound")}
              </h3>
              <p className="text-[14px] text-muted-foreground">
                {t("admin.usersPage.notFoundHint")}
              </p>
            </div>
          )}
        </div>

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
