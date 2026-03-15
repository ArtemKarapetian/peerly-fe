import { FileText, CheckCircle, Clock } from "lucide-react";
import React, { useState } from "react";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { Appeal, AppealCard, AppealStatus, appealRepo, getStatusLabel } from "@/entities/appeal";
import { useAuth } from "@/entities/user";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { AppealDetailDrawer } from "@/widgets/appeal-detail-drawer";

const statusIcons: Record<AppealStatus, React.ElementType> = {
  new: FileText,
  in_review: Clock,
  resolved: CheckCircle,
};

function StatusSection({
  status,
  appeals,
  onAppealClick,
}: {
  status: AppealStatus;
  appeals: Appeal[];
  onAppealClick: (appeal: Appeal) => void;
}) {
  if (appeals.length === 0) return null;

  const Icon = statusIcons[status];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-[20px] font-medium text-foreground">{getStatusLabel(status)}</h2>
        <span className="text-[14px] text-muted-foreground">({appeals.length})</span>
      </div>

      <div className="space-y-3">
        {appeals.map((appeal) => (
          <AppealCard key={appeal.id} appeal={appeal} onClick={() => onAppealClick(appeal)} />
        ))}
      </div>
    </div>
  );
}

export default function AppealsListPage() {
  const { user } = useAuth();
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);

  const {
    data: appeals,
    isLoading,
    error,
    refetch,
  } = useAsync(() => appealRepo.getByStudent(user?.id || "student-1"), [user?.id]);

  if (isLoading)
    return (
      <AppShell title="Апелляции">
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title="Апелляции">
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  const appealsByStatus: Record<AppealStatus, Appeal[]> = {
    new: (appeals ?? []).filter((a) => a.status === "new"),
    in_review: (appeals ?? []).filter((a) => a.status === "in_review"),
    resolved: (appeals ?? []).filter((a) => a.status === "resolved"),
  };

  return (
    <AppShell title="Апелляции">
      <Breadcrumbs items={[{ label: "Апелляции" }]} />

      <div className="max-w-[1000px]">
        <PageHeader title="Апелляции" subtitle="Список всех ваших запросов на пересмотр оценок" />

        {(appeals ?? []).length === 0 ? (
          <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-[18px] font-medium text-foreground mb-2">У вас нет апелляций</h3>
            <p className="text-[14px] text-muted-foreground mb-6">
              Если вы не согласны с оценкой, вы можете подать апелляцию из страницы задания
            </p>
            <a
              href="#/courses"
              className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium"
            >
              Перейти к курсам
            </a>
          </div>
        ) : (
          <>
            <StatusSection
              status="new"
              appeals={appealsByStatus.new}
              onAppealClick={setSelectedAppeal}
            />
            <StatusSection
              status="in_review"
              appeals={appealsByStatus.in_review}
              onAppealClick={setSelectedAppeal}
            />
            <StatusSection
              status="resolved"
              appeals={appealsByStatus.resolved}
              onAppealClick={setSelectedAppeal}
            />
          </>
        )}
      </div>

      {selectedAppeal && (
        <AppealDetailDrawer appeal={selectedAppeal} onClose={() => setSelectedAppeal(null)} />
      )}
    </AppShell>
  );
}
