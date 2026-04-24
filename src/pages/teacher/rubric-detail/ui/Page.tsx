import { ArrowLeft, Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { RubricEditor, RubricPreview } from "@/widgets/rubric-editor";
import { setRubrics, useRubric, useRubrics } from "@/widgets/rubric-editor/model/store";
import type { RubricData } from "@/widgets/rubric-editor/model/types";

type ViewMode = "edit" | "preview";

export default function TeacherRubricDetailPage() {
  const { t } = useTranslation();
  const { rubricId } = useParams<{ rubricId: string }>();
  const navigate = useNavigate();
  const rubrics = useRubrics();
  const rubric = useRubric(rubricId);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");

  if (!rubric) {
    return (
      <AppShell title={t("teacher.rubrics.title")}>
        <Breadcrumbs
          items={[
            { label: t("teacher.rubrics.breadcrumb"), href: "/teacher/rubrics" },
            { label: t("teacher.rubrics.notFound") },
          ]}
        />
        <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center mt-6">
          <h2 className="text-[20px] font-medium text-foreground mb-2">
            {t("teacher.rubrics.notFound")}
          </h2>
          <p className="text-[14px] text-muted-foreground mb-6">
            {t("teacher.rubrics.tryDifferentSearch")}
          </p>
          <button
            onClick={() => void navigate("/teacher/rubrics")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("teacher.rubrics.backToLibrary")}
          </button>
        </div>
      </AppShell>
    );
  }

  const handleSave = (updated: RubricData) => {
    setRubrics(
      rubrics.map((r) => (r.id === updated.id ? { ...updated, updatedAt: new Date() } : r)),
    );
  };

  const handleDelete = () => {
    if (confirm(t("teacher.rubrics.deleteConfirm"))) {
      setRubrics(rubrics.filter((r) => r.id !== rubric.id));
      void navigate("/teacher/rubrics");
    }
  };

  return (
    <AppShell title={rubric.name}>
      <Breadcrumbs
        items={[
          { label: t("teacher.rubrics.breadcrumb"), href: "/teacher/rubrics" },
          { label: rubric.name },
        ]}
      />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <button
                onClick={() => void navigate("/teacher/rubrics")}
                className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t("teacher.rubrics.backToLibrary")}
              </button>
              <h1 className="text-[28px] font-medium text-foreground tracking-[-0.5px] mb-1.5">
                {rubric.name}
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {rubric.description}
              </p>
              <div className="flex items-center gap-4 mt-3 text-[13px] text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">{rubric.criteria.length}</span>{" "}
                  {t("teacher.rubrics.criteriaCount")}
                </span>
                <span>·</span>
                <span>
                  {t("teacher.rubrics.updated")} {rubric.updatedAt.toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mode switcher */}
              <div className="inline-flex items-center gap-1 rounded-[10px] p-1 border-2 border-border">
                <button
                  onClick={() => setViewMode("edit")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[13px] font-medium transition-colors ${
                    viewMode === "edit"
                      ? "bg-brand-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  {t("teacher.rubrics.editor")}
                </button>
                <button
                  onClick={() => setViewMode("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[13px] font-medium transition-colors ${
                    viewMode === "preview"
                      ? "bg-brand-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {t("teacher.rubrics.previewTab")}
                </button>
              </div>

              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-border text-error rounded-[12px] hover:border-error hover:bg-error-light transition-colors text-[14px] font-medium"
              >
                <Trash2 className="w-4 h-4" />
                {t("teacher.rubrics.deleteBtn")}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "edit" ? (
          <RubricEditor rubric={rubric} onSave={handleSave} />
        ) : (
          <RubricPreview rubric={rubric} />
        )}
      </div>
    </AppShell>
  );
}
