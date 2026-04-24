import { Search, Plus, Copy, Library, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { setRubrics, useRubrics } from "@/widgets/rubric-editor/model/store";
import type { RubricData } from "@/widgets/rubric-editor/model/types";

export default function TeacherRubricsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rubrics = useRubrics();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRubrics = rubrics.filter((rubric) => {
    const q = searchQuery.toLowerCase();
    return rubric.name.toLowerCase().includes(q) || rubric.description.toLowerCase().includes(q);
  });

  const handleCreateNew = () => {
    const newRubric: RubricData = {
      id: `r${Date.now()}`,
      name: t("teacher.rubrics.newRubricName"),
      description: t("teacher.rubrics.newRubricDesc"),
      criteria: [
        {
          id: `c${Date.now()}`,
          name: t("teacher.rubrics.newCriterionName"),
          description: t("teacher.rubrics.newCriterionDesc"),
          maxScore: 5,
          required: true,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      teacherId: "u2",
    };
    setRubrics([newRubric, ...rubrics]);
    void navigate(`/teacher/rubrics/${newRubric.id}`);
  };

  const handleDuplicate = (rubric: RubricData) => {
    const newId = crypto.randomUUID();
    const duplicated: RubricData = {
      ...rubric,
      id: `r${newId}`,
      name: `${rubric.name} ${t("teacher.rubrics.copySuffix")}`,
      criteria: rubric.criteria.map((c) => ({
        ...c,
        id: `c${crypto.randomUUID()}`,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRubrics([duplicated, ...rubrics]);
    void navigate(`/teacher/rubrics/${duplicated.id}`);
  };

  return (
    <AppShell title={t("teacher.rubrics.title")}>
      <Breadcrumbs items={[{ label: t("teacher.rubrics.breadcrumb") }]} />

      <PageHeader title={t("teacher.rubrics.title")} subtitle={t("teacher.rubrics.subtitle")} />

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("teacher.rubrics.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border-2 border-border rounded-[12px] text-[14px] focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t("teacher.rubrics.create")}
        </button>
      </div>

      {/* List */}
      {filteredRubrics.length === 0 ? (
        <div className="bg-card border-2 border-border rounded-[20px] py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-[16px] bg-brand-primary-lighter/40 flex items-center justify-center mx-auto mb-4">
            <Library className="w-8 h-8 text-brand-primary" />
          </div>
          <h3 className="text-[18px] font-medium text-foreground mb-2">
            {searchQuery ? t("teacher.rubrics.notFound") : t("teacher.rubrics.createFirst")}
          </h3>
          <p className="text-[14px] text-muted-foreground mb-6 max-w-[420px] mx-auto">
            {searchQuery
              ? t("teacher.rubrics.tryDifferentSearch")
              : t("teacher.rubrics.createFirstHint")}
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
            >
              <Plus className="w-4 h-4" />
              {t("teacher.rubrics.createRubric")}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {filteredRubrics.map((rubric) => (
            <div
              key={rubric.id}
              onClick={() => void navigate(`/teacher/rubrics/${rubric.id}`)}
              className="group relative bg-card border-2 border-border rounded-[16px] p-5 cursor-pointer hover:border-brand-primary hover:shadow-[var(--shadow-md)] transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-[16px] font-medium text-foreground tracking-[-0.2px] line-clamp-2 leading-snug flex-1">
                  {rubric.name}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(rubric);
                  }}
                  className="p-1.5 rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  title={t("teacher.rubrics.duplicate")}
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[13px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {rubric.description}
              </p>

              <div className="flex items-center justify-between text-[12px] text-muted-foreground border-t border-border pt-3">
                <span className="inline-flex items-center gap-1">
                  <span className="font-medium text-foreground">{rubric.criteria.length}</span>
                  {t("teacher.rubrics.criteriaCount")}
                </span>
                <span className="inline-flex items-center gap-1 text-brand-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("teacher.rubrics.openRubric")}
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
