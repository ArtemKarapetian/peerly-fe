import { useTranslation } from "react-i18next";

export function TaskDescription() {
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6">
      <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-foreground mb-4">
        {t("widget.taskDescription.title")}
      </h2>

      <div className="space-y-4">
        <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-muted-foreground leading-[1.6]">
          {t("widget.taskDescription.mockParagraph1")}
        </p>

        <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-muted-foreground leading-[1.6]">
          {t("widget.taskDescription.mockParagraph2")}
        </p>

        <div className="bg-info-light rounded-[12px] p-4 mt-4">
          <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-foreground mb-2">
            {t("widget.taskDescription.workStructure")}
          </p>
          <ul className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>{t("widget.taskDescription.intro")}</li>
            <li>{t("widget.taskDescription.mainPart")}</li>
            <li>{t("widget.taskDescription.conclusion")}</li>
            <li>{t("widget.taskDescription.bibliography")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
