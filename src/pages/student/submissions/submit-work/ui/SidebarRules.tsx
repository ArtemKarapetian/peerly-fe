import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import type { TaskRules } from "@/features/submission/submit-work/ui/TaskRulesCard";
import { TaskRulesCard } from "@/features/submission/submit-work/ui/TaskRulesCard";

interface SidebarRulesProps {
  rules: TaskRules;
}

export function SidebarRules({ rules }: SidebarRulesProps) {
  const { t } = useTranslation();
  return (
    <div className="hide-below-desktop">
      <div className="task-sidebar-sticky">
        <Card variant="section">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            {t("page.submitWork.taskRules")}
          </h2>
          <TaskRulesCard rules={rules} />
        </Card>
      </div>
    </div>
  );
}
