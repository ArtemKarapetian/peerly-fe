import { useTranslation } from "react-i18next";

interface Criterion {
  name: string;
  points: number;
  description: string;
}

// Criteria data is populated with translation keys in the component below

export function TaskCriteria() {
  const { t } = useTranslation();

  const criteria: Criterion[] = [
    {
      name: t("widget.taskCriteria.designQuality"),
      points: 25,
      description: t("widget.taskCriteria.designQualityDesc"),
    },
    {
      name: t("widget.taskCriteria.functionality"),
      points: 25,
      description: t("widget.taskCriteria.functionalityDesc"),
    },
    {
      name: t("widget.taskCriteria.uxDesign"),
      points: 20,
      description: t("widget.taskCriteria.uxDesignDesc"),
    },
    {
      name: t("widget.taskCriteria.responsiveness"),
      points: 15,
      description: t("widget.taskCriteria.responsivenessDesc"),
    },
    {
      name: t("widget.taskCriteria.presentation"),
      points: 15,
      description: t("widget.taskCriteria.presentationDesc"),
    },
  ];

  const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="bg-muted rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
      <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-foreground mb-4">
        {t("widget.taskCriteria.title")}
      </h2>

      <div className="overflow-x-auto rounded-[12px] border border-border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-foreground">
                {t("widget.taskCriteria.criterion")}
              </th>
              <th className="text-center p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-foreground w-20 desktop:w-24">
                {t("widget.taskCriteria.points")}
              </th>
              <th className="text-left p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-foreground hidden tablet:table-cell">
                {t("widget.taskCriteria.description")}
              </th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-surface-hover transition-colors"
              >
                <td className="p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-foreground">
                  {criterion.name}
                </td>
                <td className="p-2 desktop:p-3 text-center text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-foreground">
                  {criterion.points}
                </td>
                <td className="p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-muted-foreground hidden tablet:table-cell">
                  {criterion.description}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-foreground bg-muted">
              <td className="p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-foreground">
                {t("widget.taskCriteria.total")}
              </td>
              <td className="p-2 desktop:p-3 text-center text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-foreground">
                {totalPoints}
              </td>
              <td className="p-2 desktop:p-3 hidden tablet:table-cell"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
