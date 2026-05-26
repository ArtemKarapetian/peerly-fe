import { Users, Search, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { Card } from "@/shared/ui";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

import { userRepo } from "@/entities/user";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useAsync(() => userRepo.getAll(), [], {
    onError: "redirect",
  });

  const filteredUsers = (users ?? []).filter(
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
        <ErrorBanner error={error} onRetry={refetch} />
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

  return (
    <AppShell title={t("admin.users.title")}>
      <PageHeader title={t("admin.users.title")} subtitle={t("admin.users.subtitle")} />

      <div>
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-13 font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("admin.usersPage.searchLabel")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("admin.usersPage.searchPlaceholder")}
                  className="w-full pl-11 pr-4 py-3 border-2 border-border rounded-md text-15 text-foreground focus:border-brand-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-border">
              <span className="text-13 text-muted-foreground">
                {t("admin.usersPage.filtersLabel")}
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground rounded-2sm text-xs">
                  {t("admin.usersPage.searchFilter", { query: searchQuery })}
                  <button onClick={() => setSearchQuery("")} className="hover:text-error">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-surface-hover">
                  <th className="text-left px-6 py-4 text-13 font-medium text-muted-foreground uppercase tracking-wide">
                    {t("admin.usersPage.headerUser")}
                  </th>
                  <th className="text-left px-6 py-4 text-13 font-medium text-muted-foreground uppercase tracking-wide">
                    {t("admin.usersPage.headerRole")}
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
                          <p className="text-15 font-medium text-foreground">{user.name}</p>
                          <p className="text-13 text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-2sm text-2xs font-medium ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role}
                        </span>
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
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t("admin.usersPage.notFound")}
              </h3>
              <p className="text-sm text-muted-foreground">{t("admin.usersPage.notFoundHint")}</p>
            </div>
          )}
        </Card>

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
