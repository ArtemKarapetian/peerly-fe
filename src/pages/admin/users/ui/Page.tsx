import { Users, Search, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";
import { Card, EmptyState, Field, TextField } from "@/shared/ui";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

import { userRepo } from "@/entities/user";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

const MIN_SEARCH_LENGTH = 3;

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const canSearch = debouncedQuery.trim().length >= MIN_SEARCH_LENGTH;

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useAsync(
    () => (canSearch ? userRepo.search(debouncedQuery.trim()) : Promise.resolve([])),
    [debouncedQuery, canSearch],
    {
      onError: "redirect",
    },
  );

  const filteredUsers = users ?? [];

  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    filteredUsers,
    10,
  );

  if (isLoading && canSearch)
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
          <Field label={t("admin.usersPage.searchLabel")}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("admin.usersPage.searchPlaceholder")}
                className="pl-11"
              />
            </div>
          </Field>

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

          {!canSearch && (
            <EmptyState
              icon={Search}
              title={t("admin.usersPage.searchPromptTitle")}
              message={t("admin.usersPage.searchPromptHint")}
            />
          )}
          {canSearch && !isLoading && filteredUsers.length === 0 && (
            <EmptyState
              icon={Users}
              title={t("admin.usersPage.notFound")}
              message={t("admin.usersPage.notFoundHint")}
            />
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
