import { ChevronRight, Layers, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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
        <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.rubric.title")}
        </h2>
        <p className="text-[15px] text-muted-foreground">
          {t("feature.assignmentCreate.rubric.subtitle")}
        </p>
      </div>

      {selected && (
        <div className="bg-success-light border-2 border-success rounded-[12px] p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-success" />
                <h3 className="text-[16px] font-medium text-foreground">
                  {t("feature.assignmentCreate.rubric.selectedRubric")}
                </h3>
              </div>
              <p className="text-[15px] text-foreground font-medium mb-1">{selected.name}</p>
              <p className="text-[13px] text-muted-foreground mb-2">{selected.description}</p>
              <span className="text-[13px] text-muted-foreground">
                {selected.criteria.length} {t("feature.assignmentCreate.rubric.criteria")}
              </span>
            </div>
            <button
              onClick={handleDeselect}
              className="px-3 py-2 text-[13px] text-muted-foreground hover:text-destructive transition-colors"
            >
              {t("feature.assignmentCreate.rubric.deselect")}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleCreateNew}
        className="w-full flex items-center justify-between p-4 border-2 border-dashed border-brand-primary bg-brand-primary-light rounded-[12px] hover:border-brand-primary hover:bg-brand-primary-light transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-[8px] flex items-center justify-center group-hover:bg-brand-primary-hover transition-colors">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-medium text-foreground">
              {t("feature.assignmentCreate.rubric.createNew")}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {t("feature.assignmentCreate.rubric.createNewHint")}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
      </button>

      {rubrics.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("feature.assignmentCreate.rubric.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
      )}

      <div>
        <h3 className="text-[14px] font-medium text-foreground mb-3">
          {t("feature.assignmentCreate.rubric.library")}
        </h3>

        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-muted border border-border rounded-[12px]">
            <Layers className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-[15px] text-muted-foreground">
              {t("feature.assignmentCreate.rubric.noRubrics")}
            </p>
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
                  className={`w-full text-left p-4 border-2 rounded-[12px] transition-all ${
                    isSelected
                      ? "border-brand-primary bg-brand-primary-light"
                      : "border-border hover:border-brand-primary bg-card"
                  }`}
                >
                  <h4 className="text-[15px] font-medium text-foreground mb-2">{rubric.name}</h4>
                  <p className="text-[13px] text-muted-foreground mb-3 line-clamp-2">
                    {rubric.description}
                  </p>
                  <span className="text-[12px] text-muted-foreground">
                    {rubric.criteria.length} {t("feature.assignmentCreate.rubric.criteria")}
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

      <div className="bg-info-light border border-info rounded-[12px] p-4">
        <p className="text-[13px] text-foreground">
          <strong>{t("feature.assignmentCreate.rubric.skipTip")}</strong>{" "}
          {t("feature.assignmentCreate.rubric.skipTipText")}
        </p>
      </div>
    </div>
  );
}
