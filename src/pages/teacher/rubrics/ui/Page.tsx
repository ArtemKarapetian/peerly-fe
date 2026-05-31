import { Search, Plus, Library, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Card } from "@/shared/ui";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

import { useCreateRubric, useRubrics } from "@/entities/rubric";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

const PAGE_SIZE = 12;

export default function TeacherRubricsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: rubrics, isLoading, error, refetch } = useRubrics();
  const createMutation = useCreateRubric();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRubrics = (rubrics ?? []).filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    filteredRubrics,
    PAGE_SIZE,
  );

  const handleCreateNew = async () => {
    const created = await createMutation.mutateAsync({
      name: t("teacher.rubrics.newRubricName"),
      criteria: [
        {
          name: t("teacher.rubrics.newCriterionName"),
          description: undefined,
          maxScore: 5,
          commentRequired: false,
          position: 0,
        },
      ],
    });
    void navigate(`/teacher/rubrics/${created.rubricId}`);
  };

  if (isLoading) {
    return (
      <AppShell title={t("teacher.rubrics.title")}>
        <PageSkeleton />
      </AppShell>
    );
  }
  if (error) {
    return (
      <AppShell title={t("teacher.rubrics.title")}>
        <ErrorBanner error={error} onRetry={() => void refetch()} />
      </AppShell>
    );
  }

  return (
    <AppShell title={t("teacher.rubrics.title")}>
      <Breadcrumbs items={[{ label: t("teacher.rubrics.breadcrumb") }]} />
      <PageHeader title={t("teacher.rubrics.title")} subtitle={t("teacher.rubrics.subtitle")} />

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("teacher.rubrics.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border-2 border-border rounded-md text-sm focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <button
          onClick={() => void handleCreateNew()}
          disabled={createMutation.isPending}
          className="inline-flex items-center gap-2 px-4 py-3 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors text-sm font-medium shrink-0 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {t("teacher.rubrics.create")}
        </button>
      </div>

      {filteredRubrics.length === 0 ? (
        <Card className="py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-lg bg-brand-primary-lighter/40 flex items-center justify-center mx-auto mb-4">
            <Library className="w-8 h-8 text-brand-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery ? t("teacher.rubrics.notFound") : t("teacher.rubrics.createFirst")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-[420px] mx-auto">
            {searchQuery
              ? t("teacher.rubrics.tryDifferentSearch")
              : t("teacher.rubrics.createFirstHint")}
          </p>
          {!searchQuery && (
            <button
              onClick={() => void handleCreateNew()}
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {t("teacher.rubrics.createRubric")}
            </button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {currentItems.map((rubric) => (
            <div
              key={rubric.id}
              onClick={() => void navigate(`/teacher/rubrics/${rubric.id}`)}
              className="group relative bg-card border-2 border-border rounded-lg p-5 cursor-pointer hover:border-brand-primary hover:shadow-[var(--shadow-md)] transition-all"
            >
              <h3 className="text-base font-medium text-foreground tracking-[-0.2px] line-clamp-2 leading-snug mb-3">
                {rubric.name}
              </h3>
              <div className="flex items-center justify-end text-xs text-muted-foreground border-t border-border pt-3">
                <span className="inline-flex items-center gap-1 text-brand-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("teacher.rubrics.openRubric")}
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRubrics.length > 0 && (
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
