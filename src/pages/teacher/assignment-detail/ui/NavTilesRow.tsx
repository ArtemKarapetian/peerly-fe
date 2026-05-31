import { BarChart3, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface NavTilesRowProps {
  assignmentId: string;
}

export function NavTilesRow({ assignmentId }: NavTilesRowProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mt-6 grid grid-cols-1 tablet:grid-cols-2 gap-4">
      <NavTile
        icon={FileText}
        title={t("teacher.assignmentDetail.submissions")}
        description={t("teacher.assignmentDetail.submissionsDesc")}
        onClick={() => void navigate(`/teacher/submissions?assignmentId=${assignmentId}`)}
      />
      <NavTile
        icon={BarChart3}
        title={t("teacher.assignmentDetail.analyticsTitle")}
        description={t("teacher.assignmentDetail.analyticsDesc")}
        onClick={() => void navigate(`/teacher/analytics?assignmentId=${assignmentId}`)}
      />
    </div>
  );
}

interface NavTileProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

function NavTile({ icon: Icon, title, description, onClick }: NavTileProps) {
  return (
    <button
      onClick={onClick}
      className="p-6 bg-card border border-border shadow-sm rounded-lg hover:border-brand-primary hover:bg-info-light transition-all text-left"
    >
      <Icon className="w-6 h-6 text-brand-primary mb-3" />
      <h3 className="text-base font-medium text-foreground mb-2">{title}</h3>
      <p className="text-13 text-muted-foreground">{description}</p>
    </button>
  );
}
