import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

export function EmptyGradesView() {
  const { t } = useTranslation();
  return (
    <Card className="p-0 overflow-hidden">
      <div className="py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t("widget.gradeTable.noGrades")}
        </h3>
        <p className="text-sm text-muted-foreground">{t("widget.gradeTable.noGradesHint")}</p>
      </div>
    </Card>
  );
}
