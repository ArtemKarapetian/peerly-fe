import { ArrowLeft, Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { Card } from "@/shared/ui";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { type RubricDetail, useDeleteRubric, useRubric, useUpdateRubric } from "@/entities/rubric";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { RubricEditor, RubricPreview, type RubricEditorData } from "@/widgets/rubric-editor";

type ViewMode = "edit" | "preview";

function detailToEditor(d: RubricDetail): RubricEditorData {
  return {
    id: d.rubric.id,
    teacherId: d.rubric.teacherId,
    name: d.rubric.name,
    criteria: d.criteria.map((c, i) => ({
      id: c.id,
      name: c.name,
      description: c.description ?? "",
      maxScore: c.maxScore,
      commentRequired: c.commentRequired,
      position: c.position ?? i,
    })),
  };
}

export default function TeacherRubricDetailPage() {
  const { t } = useTranslation();
  const { rubricId } = useParams<{ rubricId: string }>();
  const navigate = useNavigate();
  const { data: detail, isLoading, error, refetch } = useRubric(rubricId);
  const updateMutation = useUpdateRubric();
  const deleteMutation = useDeleteRubric();
  const [viewMode, setViewMode] = useState<ViewMode>("edit");

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
  if (!detail) {
    return (
      <AppShell title={t("teacher.rubrics.title")}>
        <Breadcrumbs
          items={[
            { label: t("teacher.rubrics.breadcrumb"), href: "/teacher/rubrics" },
            { label: t("teacher.rubrics.notFound") },
          ]}
        />
        <Card className="p-12 text-center mt-6">
          <h2 className="text-xl font-medium text-foreground mb-2">
            {t("teacher.rubrics.notFound")}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {t("teacher.rubrics.tryDifferentSearch")}
          </p>
          <button
            onClick={() => void navigate(ROUTES.teacherRubrics)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("teacher.rubrics.backToLibrary")}
          </button>
        </Card>
      </AppShell>
    );
  }

  const editable = detailToEditor(detail);

  const handleSave = async (updated: RubricEditorData) => {
    await updateMutation.mutateAsync({
      rubricId: detail.rubric.id,
      input: {
        name: updated.name,
        criteria: updated.criteria.map((c, i) => ({
          name: c.name,
          description: c.description.trim() ? c.description : undefined,
          maxScore: c.maxScore,
          commentRequired: c.commentRequired,
          position: i,
        })),
      },
    });
    void navigate(ROUTES.teacherRubrics);
  };

  const handleDelete = async () => {
    if (!confirm(t("teacher.rubrics.deleteConfirm"))) return;
    await deleteMutation.mutateAsync(detail.rubric.id);
    void navigate(ROUTES.teacherRubrics);
  };

  return (
    <AppShell title={detail.rubric.name}>
      <Breadcrumbs
        items={[
          { label: t("teacher.rubrics.breadcrumb"), href: "/teacher/rubrics" },
          { label: detail.rubric.name },
        ]}
      />

      <div className="mt-6 space-y-6">
        <Card>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <button
                onClick={() => void navigate(ROUTES.teacherRubrics)}
                className="inline-flex items-center gap-1.5 text-13 text-muted-foreground hover:text-foreground transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t("teacher.rubrics.backToLibrary")}
              </button>
              <h1 className="text-[28px] font-medium text-foreground tracking-[-0.5px] mb-1.5">
                {detail.rubric.name}
              </h1>
              <div className="flex items-center gap-4 text-13 text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">{detail.criteria.length}</span>{" "}
                  {t("teacher.rubrics.criteriaCount", { count: detail.criteria.length })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1 rounded-2md p-1 border-2 border-border">
                <button
                  onClick={() => setViewMode("edit")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-13 font-medium transition-colors ${
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-13 font-medium transition-colors ${
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
                onClick={() => void handleDelete()}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-border text-error rounded-md hover:border-error hover:bg-error-light transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {t("teacher.rubrics.deleteBtn")}
              </button>
            </div>
          </div>
        </Card>

        {viewMode === "edit" ? (
          <RubricEditor rubric={editable} onSave={(u) => void handleSave(u)} />
        ) : (
          <RubricPreview rubric={editable} />
        )}
      </div>
    </AppShell>
  );
}
