import { useTranslation } from "react-i18next";

interface FinalMarkAsideProps {
  finalMark: number | null;
}

export function FinalMarkAside({ finalMark }: FinalMarkAsideProps) {
  const { t } = useTranslation();
  return (
    <aside className="desktop:col-span-1">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {t("student.submissions.finalMarkTitle")}
        </h2>
        {finalMark != null ? (
          <div className="text-[40px] font-medium text-foreground leading-none">
            {finalMark}
            <span className="text-xl text-muted-foreground">/5</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            {t("student.submissions.noFinalMark")}
          </p>
        )}
      </div>
    </aside>
  );
}
