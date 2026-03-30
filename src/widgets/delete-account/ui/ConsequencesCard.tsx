import { useTranslation } from "react-i18next";

export function ConsequencesCard() {
  const { t } = useTranslation();

  const CONSEQUENCES = [
    {
      title: t("widget.deleteAccount.consequenceLossAccessTitle"),
      text: t("widget.deleteAccount.consequenceLossAccessText"),
    },
    {
      title: t("widget.deleteAccount.consequenceDeleteWorksTitle"),
      text: t("widget.deleteAccount.consequenceDeleteWorksText"),
    },
    {
      title: t("widget.deleteAccount.consequenceLossReviewsTitle"),
      text: t("widget.deleteAccount.consequenceLossReviewsText"),
    },
    {
      title: t("widget.deleteAccount.consequenceGradeHistoryTitle"),
      text: t("widget.deleteAccount.consequenceGradeHistoryText"),
    },
    {
      title: t("widget.deleteAccount.consequencePersonalDataTitle"),
      text: t("widget.deleteAccount.consequencePersonalDataText"),
    },
  ];

  return (
    <div className="bg-card border border-border rounded-[20px] p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {t("widget.deleteAccount.consequencesTitle")}
      </h2>

      <ul className="space-y-3">
        {CONSEQUENCES.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{item.title}</strong> {item.text}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 bg-info-light border border-info rounded-[12px]">
        <p className="text-sm text-foreground/80">
          <strong>{t("widget.deleteAccount.importantNote")}</strong>{" "}
          {t("widget.deleteAccount.importantNoteText")}
        </p>
      </div>
    </div>
  );
}
