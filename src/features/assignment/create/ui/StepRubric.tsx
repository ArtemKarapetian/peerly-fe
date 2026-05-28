import { ChevronRight, Info, Layers, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState, TextField } from "@/shared/ui";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

import type { AssignmentFormData, RubricOption } from "../model/types";

interface StepRubricProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
  rubrics: RubricOption[];
}

const PAGE_SIZE = 5;

export function StepRubric({ data, onUpdate, rubrics }: StepRubricProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rubrics;
    return rubrics.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
    );
  }, [rubrics, searchQuery]);

  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    filtered,
    PAGE_SIZE,
  );

  const selected = rubrics.find((r) => r.id === data.rubricId);

  const handleSelect = (id: string, name: string) => onUpdate({ rubricId: id, rubricName: name });
  const handleDeselect = () => onUpdate({ rubricId: null, rubricName: undefined });
  const handleCreateNew = () => window.open("/teacher/rubrics", "_blank");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.rubric.title")}
        </h2>
      </div>

      {!selected && (
        <div
          data-testid="no-rubric-banner"
          className="flex items-start gap-3 bg-info-light border border-info rounded-md p-4"
        >
          <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              {t("feature.assignmentCreate.rubric.noRubricBannerTitle")}
            </p>
            <p className="text-13 text-muted-foreground">
              {t("feature.assignmentCreate.rubric.noRubricBanner")}
            </p>
          </div>
        </div>
      )}

      {selected && (
        <div className="bg-success-light border-2 border-success rounded-md p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-success" />
                <h3 className="text-base font-medium text-foreground">
                  {t("feature.assignmentCreate.rubric.selectedRubric")}
                </h3>
              </div>
              <p className="text-15 text-foreground font-medium mb-1">{selected.name}</p>
              <p className="text-13 text-muted-foreground mb-2">{selected.description}</p>
              <span className="text-13 text-muted-foreground">
                {t("feature.assignmentCreate.rubric.criteria", { count: selected.criteria.length })}
              </span>
            </div>
            <button
              onClick={handleDeselect}
              className="px-3 py-2 text-13 text-muted-foreground hover:text-destructive transition-colors"
            >
              {t("feature.assignmentCreate.rubric.deselect")}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleCreateNew}
        className="w-full flex items-center justify-between p-4 border-2 border-dashed border-brand-primary bg-brand-primary-light rounded-md hover:border-brand-primary hover:bg-brand-primary-light transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-sm flex items-center justify-center group-hover:bg-brand-primary-hover transition-colors">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="text-15 font-medium text-foreground">
              {t("feature.assignmentCreate.rubric.createNew")}
            </p>
            <p className="text-13 text-muted-foreground">
              {t("feature.assignmentCreate.rubric.createNewHint")}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
      </button>

      {rubrics.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <TextField
            placeholder={t("feature.assignmentCreate.rubric.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">
          {t("feature.assignmentCreate.rubric.library")}
        </h3>

        {filtered.length === 0 ? (
          <div className="bg-muted border border-border rounded-md">
            <EmptyState icon={Layers} message={t("feature.assignmentCreate.rubric.noRubrics")} />
          </div>
        ) : (
          <div className="space-y-3">
            {currentItems.map((rubric) => {
              const isSelected = data.rubricId === rubric.id;
              return (
                <button
                  key={rubric.id}
                  type="button"
                  onClick={() => handleSelect(rubric.id, rubric.name)}
                  className={`w-full text-left p-4 border-2 rounded-md transition-all ${
                    isSelected
                      ? "border-brand-primary bg-brand-primary-light"
                      : "border-border hover:border-brand-primary bg-card"
                  }`}
                >
                  <h4 className="text-15 font-medium text-foreground mb-2">{rubric.name}</h4>
                  <p className="text-13 text-muted-foreground mb-3 line-clamp-2">
                    {rubric.description}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {t("feature.assignmentCreate.rubric.criteria", {
                      count: rubric.criteria.length,
                    })}
                  </span>
                </button>
              );
            })}
            <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
